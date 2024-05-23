from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required

from exts import db
from model.address import Resource, Address, Alert
from model.user import User


def create_resource_router():
    resource_bp = Blueprint('resource_bp', __name__, url_prefix='/api')

    @resource_bp.route('/addresses', methods=['GET'])
    def get_all_addresses():
        try:
            offset = int(request.args.get('offset', 0))
            pageNum = int(request.args.get('pageNum', 1))

            # 查询地址数据
            addresses_query = (
                db.session.query(Address, User)
                    .join(User, Address.uid == User.uid)
            )

            # 计算总页数
            total_addresses = addresses_query.count()
            total_pages = (total_addresses + offset - 1) // offset

            # 分页处理
            addresses = addresses_query.limit(offset).offset((pageNum - 1) * offset).all()

            # 构造响应数据
            response_data = {
                'addresses': [{
                    'aid': address.aid,
                    'building': address.building,
                    'unit': address.unit,
                    'room': address.room,
                    'user_name': user.name,
                    'phone': user.phone
                } for address, user in addresses],
                'allPages': total_pages
            }

            return jsonify(code=200, data=response_data, message="All addresses retrieved successfully"), 200
        except Exception as e:
            # 如果出现异常，回滚事务并返回错误响应
            db.session.rollback()
            return jsonify(code=404, message=f"An error occurred while retrieving addresses: {str(e)}"), 404

    @resource_bp.route('/addresses/resources/<int:aid>', methods=['POST'])
    @jwt_required()
    def add_resource(aid):
        try:
            # 开启数据库事务
            db.session.begin()

            # 从请求中获取参数
            data = request.json
            resource_type = data.get('type')
            value = data.get('value')
            month = data.get('month')
            year = data.get('year')

            # 创建资源实例
            resource = Resource(
                type=resource_type,
                value=value,
                month=month,
                year=year,
                aid=aid
            )

            # 将资源添加到数据库中
            db.session.add(resource)
            db.session.commit()

            # 构造响应数据
            response_data = {
                'resource_id': resource.resource_id
            }

            return jsonify(code=200, data=response_data, message="Resource added successfully"), 200
        except Exception as e:
            # 如果出现异常，回滚事务并返回错误响应
            db.session.rollback()
            return jsonify(code=404, message=f"An error occurred while adding the resource: {str(e)}"), 404

    @resource_bp.route('/addresses/resources/<int:resource_id>', methods=['DELETE'])
    @jwt_required()
    def delete_resource(resource_id):
        try:
            # 开启事务
            db.session.begin()

            # 查询要删除的资源
            resource = Resource.query.get(resource_id)
            if not resource:
                return jsonify(code=404, message="Resource not found"), 404

            # 删除资源
            db.session.delete(resource)
            db.session.commit()

            # 构造响应数据
            response_data = {
                'resource_id': resource_id
            }

            return jsonify(code=200, data=response_data, message="Resource deleted successfully"), 200
        except Exception as e:
            # 如果出现异常，回滚事务并返回错误响应
            db.session.rollback()
            return jsonify(code=404, message=f"An error occurred while deleting the resource: {str(e)}"), 404

    @resource_bp.route('/addresses/resources/<int:uid>', methods=['GET'])
    def get_address_resources(uid):
        try:
            offset = int(request.args.get('offset', 0))
            pageNum = int(request.args.get('pageNum', 1))
            
            user_address = Address.query.filter_by(uid=uid).first()
            if not user_address:
                return jsonify(code=404, message="User address not found"), 404

            # 查询地址的资源
            resources_query = (
                db.session.query(Resource)
                    .filter(Resource.aid == user_address.aid)
            )

            # 分页处理
            per_page = offset  # offset就是一页多少数据
            resources = resources_query.limit(per_page).offset((pageNum - 1) * per_page).all()

            # 查询相同类型的警报值
            alert_value = (
                db.session.query(Alert.value)
                    .filter(Alert.aid == user_address.aid)
                    .filter(Alert.type == Resource.type)
                    .first()
            )

            # 构造响应数据
            response_data = {
                'resources': [],
                'allPages': len(resources)
            }
            for resource in resources:
                comparison = False
                if alert_value and resource.value >= alert_value:
                    comparison = True
                response_data['resources'].append({
                    'resource_id': resource.resource_id,
                    'type': resource.type,
                    'value': resource.value,
                    'month': resource.month,
                    'year': resource.year,
                    'comparison': comparison
                })
            # response_data = {
            #     'resources': [{
            #         'resource_id': resource.resource_id,
            #         'type': resource.type,
            #         'value': resource.value,
            #         'month': resource.month,
            #         'year': resource.year,
            #         'comparison': resource.value >= alert_value
            #     } for resource in resources],
            #     'allPages': len(resources)  # 总页数
            # }

            return jsonify(code=200, data=response_data, message="Address resources retrieved successfully"), 200
        except Exception as e:
            # 如果出现异常，返回错误响应
            return jsonify(code=404, message=f"An error occurred while retrieving address resources: {str(e)}"), 404

    @resource_bp.route('/addresses/alert/<int:uid>', methods=['POST'])
    @jwt_required()
    def create_alert(uid):
        try:
            # 从请求中获取参数
            data = request.json
            alert_type = data.get('type')
            alert_value = data.get('value')
            
            user_address = Address.query.filter_by(uid=uid).first()
            if not user_address:
                return jsonify(code=404, message="User address not found"), 404

            # 检查数据库中是否已经存在相同类型的阈值
            existing_alert = Alert.query.filter_by(aid=user_address.aid, type=alert_type).first()
            if existing_alert:
                return jsonify(code=404, message=f"Alert of type {alert_type} already exists for this address"), 404

            # 创建阈值记录
            new_alert = Alert(type=alert_type, value=alert_value, aid=user_address.aid)

            # 添加到数据库中
            db.session.add(new_alert)
            db.session.commit()

            # 构造响应数据
            response_data = {
                'alert_id': new_alert.alert_id
            }

            return jsonify(code=200, data=response_data, message="Alert created successfully"), 200
        except Exception as e:
            # 如果出现异常，返回错误响应
            return jsonify(code=404, message=f"An error occurred while creating Alert: {str(e)}"), 404

    @resource_bp.route('/addresses/alert/<int:alert_id>', methods=['DELETE'])
    @jwt_required()
    def delete_alert(alert_id):
        try:
            # 查询要删除的阈值
            alert = Alert.query.get(alert_id)

            # 如果阈值不存在，返回404
            if not alert:
                return jsonify(code=404, message="Threshold not found"), 404

            # 删除阈值
            db.session.delete(alert)
            db.session.commit()

            # 构造响应数据
            response_data = {
                'alert_id': alert_id
            }

            return jsonify(code=200, data=response_data, message="Alert deleted successfully"), 200
        except Exception as e:
            # 如果出现异常，返回错误响应
            return jsonify(code=404, message=f"An error occurred while deleting Alert: {str(e)}"), 404

    @resource_bp.route('/addresses/alert/<int:alert_id>', methods=['PATCH'])
    @jwt_required()
    def update_alert(alert_id):
        try:
            # 从请求中获取参数
            data = request.json
            alert_type = data.get('type')
            alert_value = data.get('value')

            # 查询要修改的阈值
            alert = Alert.query.get(alert_id)

            # 如果阈值不存在，返回404
            if not alert:
                return jsonify(code=404, message="Alert not found"), 404

            # 更新阈值
            alert.type = alert_type
            alert.value = alert_value
            db.session.commit()

            # 构造响应数据
            response_data = {
                'alert_id': alert_id
            }

            return jsonify(code=200, data=response_data, message="Alert updated successfully"), 200
        except Exception as e:
            # 如果出现异常，返回错误响应
            return jsonify(code=404, message=f"An error occurred while updating alert: {str(e)}"), 404

    @resource_bp.route('/addresses/alert/<int:uid>', methods=['GET'])
    def get_alert(uid):
        try:
            user_address = Address.query.filter_by(uid=uid).first()
            if not user_address:
                return jsonify(code=404, message="User address not found"), 404
          
            # 查询阈值
            alerts = Alert.query.filter_by(aid=user_address.aid).all()

            # 如果阈值不存在，返回404
            if not alerts:
                return jsonify(code=404, message="Alerts not found"), 404

            # 构造响应数据
            response_data = [{
                'alert_id': alert.alert_id,
                'type': alert.type,
                'value': alert.value
            } for alert in alerts]

            return jsonify(code=200, data=response_data, message="Alerts retrieved successfully"), 200
        except Exception as e:
            # 如果出现异常，返回错误响应
            return jsonify(code=404, message=f"An error occurred while retrieving alerts: {str(e)}"), 404

    return resource_bp
