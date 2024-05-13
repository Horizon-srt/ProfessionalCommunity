from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity

from exts import db
from model.user import User
from model.address import Address, ServiceRecord
from model.service import Service, FixedService, OndoorService


class ServiceType:
    FIXED = 'FIXED'
    ONDOOR = 'ONDOOR'


def create_service_router():
    service_bp = Blueprint('service_bp', __name__)

    @service_bp.route('/services', methods=['POST'])
    @jwt_required()
    def add_service():
        try:
            data = request.json
            name = data.get('name')
            cover = data.get('cover').encode()
            available = data.get('available')
            detail = data.get('detail').encode()
            service_type = data.get('type')

            new_service = Service(
                name=name,
                cover=cover,
                available=available,
                detail=detail
            )

            db.session.begin()
            db.session.add(new_service)
            db.session.commit()

            if service_type == ServiceType.FIXED:
                location = data.get('location')
                map_ = data.get('map')
                video = data.get('video').encode()
                new_fixed_service = FixedService(
                    sid=new_service.sid,
                    location=location,
                    map=map_,
                    video=video
                )
                db.session.add(new_fixed_service)
            elif service_type == ServiceType.ONDOOR:
                line = data.get('line')
                new_ondoor_service = OndoorService(
                    sid=new_service.sid,
                    line=line
                )
                db.session.add(new_ondoor_service)
            else:
                return jsonify(code=500, message="Invalid service type")

            db.session.commit()

            return jsonify(code=200, data={'sid': new_service.sid}, message="Service added successfully"), 200
        except Exception as e:
            db.session.rollback()
            return jsonify(code=500, message=f"An error occurred while adding the service: {str(e)}"), 500

    @service_bp.route('/services/<int:sid>', methods=['DELETE'])
    @jwt_required()
    def delete_service(sid):
        try:
            db.session.begin()

            # Check if the service exists
            service = Service.query.get(sid)
            if not service:
                return jsonify(code=404, message="Service not found"), 404

            # Delete associated service records
            ServiceRecord.query.filter_by(sid=sid).delete()

            # Check if the service has fixed service or ondoor service associated with it
            fixed_service = FixedService.query.filter_by(sid=sid).first()
            if fixed_service:
                db.session.delete(fixed_service)

            ondoor_service = OndoorService.query.filter_by(sid=sid).first()
            if ondoor_service:
                db.session.delete(ondoor_service)

            # Delete the service
            db.session.delete(service)
            db.session.commit()

            return jsonify(code=200, data={'sid': sid}, message="Service deleted successfully"), 200
        except Exception as e:
            db.session.rollback()
            return jsonify(code=500, message=f"An error occurred while deleting the service: {str(e)}"), 500

    @service_bp.route('/services/<int:sid>', methods=['PATCH'])
    @jwt_required()
    def update_service(sid):
        try:
            db.session.begin()

            # Check if the service exists
            service = Service.query.get(sid)
            if not service:
                return jsonify(code=404, message="Service not found"), 404

            # Update service attributes if provided in the request
            data = request.json
            if 'name' in data:
                service.name = data['name']
            if 'cover' in data:
                service.cover = data['cover'].encode()
            if 'available' in data:
                service.available = data['available']
            if 'detail' in data:
                service.detail = data['detail'].encode()

            # Update specific attributes based on service type
            fixed_service = FixedService.query.filter_by(sid=sid).first()
            ondoor_service = OndoorService.query.filter_by(sid=sid).first()

            if fixed_service:
                service_type = ServiceType.FIXED
                if 'location' in data:
                    fixed_service.location = data['location']
                if 'map' in data:
                    fixed_service.map = data['map']
                if 'video' in data:
                    fixed_service.video = data['video'].encode() if data.get('video') else None

            elif ondoor_service:
                service_type = ServiceType.ONDOOR
                if 'line' in data:
                    ondoor_service.line = data['line']

            else:
                return jsonify(code=404, message="Service not found"), 404

            db.session.commit()

            # Construct response data
            response_data = {
                'sid': sid,
                'name': service.name,
                'cover': service.cover.decode(),
                'available': service.available,
                'detail': service.detail.decode(),
                'type': service_type,
                'location': getattr(fixed_service, 'location', None) if service_type == ServiceType.FIXED else None,
                'map': getattr(fixed_service, 'map', None) if service_type == ServiceType.FIXED else None,
                'video': getattr(fixed_service, 'video', None).decode() if (
                            service_type == ServiceType.FIXED and getattr(fixed_service, 'video', None)) else None,
                'line': getattr(ondoor_service, 'line', None) if service_type == ServiceType.ONDOOR else None
            }

            return jsonify(code=200, data=response_data, message="Service updated successfully"), 200
        except Exception as e:
            db.session.rollback()
            return jsonify(code=500, message=f"An error occurred while updating the service: {str(e)}"), 500

    @service_bp.route('/services', methods=['GET'])
    @jwt_required()
    def get_services():
        try:
            service_type = request.args.get('type', None)
            offset = int(request.args.get('offset', 0))
            pageNum = int(request.args.get('pageNum', 1))

            # 查询服务并分页
            if service_type == ServiceType.FIXED:
                services_query = db.session.query(Service, FixedService).join(FixedService)
            elif service_type == ServiceType.ONDOOR:
                services_query = db.session.query(Service, OndoorService).join(OndoorService)
            else:
                return jsonify(code=400, message="Invalid service type"), 400

            services = services_query.limit(offset).offset((pageNum - 1) * offset).all()

            # 构造返回数据
            services_data = []
            for service, service_detail in services:
                service_data = {
                    "sid": service.sid,
                    "name": service.name,
                    "cover": service.cover.decode(),
                    "available": service.available,
                    "detail_slice": service.detail.decode()[:50] if service.detail else None
                }
                services_data.append(service_data)
                
            total_services = services_query.count()
            total_pages = (total_services + offset - 1) // offset

            return jsonify(code=200, data={"services": services_data, "total_services": total_pages}, message="Services retrieved successfully"), 200
        except Exception as e:
            return jsonify(code=500, message=f"An error occurred while retrieving services: {str(e)}"), 500

    @service_bp.route('/services/<int:sid>', methods=['GET'])
    @jwt_required()
    def get_service(sid):
        try:
            # 查询服务
            service = Service.query.get(sid)
            if not service:
                return jsonify(code=404, message="未找到服务"), 404

            # 判断服务类型并查询相关详情
            fixed_service = FixedService.query.filter_by(sid=sid).first()
            ondoor_service = OndoorService.query.filter_by(sid=sid).first()

            # 构造返回数据
            response_data = {
                "sid": service.sid,
                "name": service.name,
                "cover": service.cover.decode() if service.cover else None,
                "available": service.available,
                "detail": service.detail.decode() if service.detail else None,
                "type": None,
                "location": None,
                "map": None,
                "video": None,
                "line": None
            }

            # 设置服务类型和相应的详情
            if fixed_service:
                response_data["type"] = "FIXED"
                response_data["location"] = fixed_service.location
                response_data["map"] = fixed_service.map
                response_data["video"] = fixed_service.video.decode()
            elif ondoor_service:
                response_data["type"] = "ONDOOR"
                response_data["line"] = ondoor_service.line

            return jsonify(code=200, data=response_data, message="服务获取成功"), 200
        except Exception as e:
            return jsonify(code=500, message=f"获取服务时出现错误: {str(e)}"), 500

    @service_bp.route('/services/subscribe', methods=['POST'])
    @jwt_required()
    def subscribe_service():
        try:
            # 解析请求参数
            data = request.json
            sid = data.get('sid')
            time = data.get('time')
            detail = data.get('detail')

            # 获取当前用户的地址 ID（aid）
            current_user_id = get_jwt_identity()
            user_address = Address.query.filter_by(uid=current_user_id).first()
            if not user_address:
                return jsonify(code=404, message="User address not found"), 404
            aid = user_address.aid

            # 创建服务记录
            service_record = ServiceRecord(
                time=time,
                detail=detail.encode(),
                sid=sid,
                aid=aid
            )

            # 提交事务
            db.session.add(service_record)
            db.session.commit()

            return jsonify(code=200, data={'sid': sid}, message="Service subscribed successfully"), 200
        except Exception as e:
            db.session.rollback()
            return jsonify(code=500, message=f"An error occurred while subscribing to the service: {str(e)}"), 500

    @service_bp.route('/services/subscribe/<int:uid>', methods=['GET'])
    @jwt_required()
    def get_user_subscriptions(uid):
        try:
            # 获取用户地址信息
            user_address = Address.query.filter_by(uid=uid).first()
            if not user_address:
                return jsonify(code=404, message="User address not found"), 404
            # 获取地址详情
            building = user_address.building
            unit = user_address.unit
            room = user_address.room

            # 查询用户的服务记录
            service_records = ServiceRecord.query.filter_by(aid=user_address.aid).all()

            # 构造返回数据
            subscriptions = []
            for record in service_records:
                service_name = ""
                detail = ""
                time = record.time
                if record.sid:
                    service = Service.query.get(record.sid)
                    if service:
                        service_name = service.name
                        detail = service.detail.decode() if service.detail else ""
                        fixed_service = FixedService.query.filter_by(sid=record.sid).first()
                        if fixed_service:
                            detail = fixed_service.location
                        ondoor_service = OndoorService.query.filter_by(sid=record.sid).first()
                        if ondoor_service:
                            detail = ondoor_service.line

                subscription_data = {
                    "building": building,
                    "unit": unit,
                    "room": room,
                    "name": user_address.user.name if user_address.user else "",
                    "service_name": service_name,
                    "phone": user_address.user.phone if user_address.user else "",
                    "line": ondoor_service.line if ondoor_service else "",
                    "detail": detail,
                    "time": time
                }
                subscriptions.append(subscription_data)

            return jsonify(code=200, data={"subscriptions": subscriptions},
                           message="User subscriptions retrieved successfully"), 200
        except Exception as e:
            return jsonify(code=500, message=f"An error occurred while retrieving user subscriptions: {str(e)}"), 500

    # 查看全部订阅
    @service_bp.route('/services/subscribe', methods=['GET'])
    @jwt_required()
    def get_all_subscriptions():
        try:
            offset = int(request.args.get('offset', 0))
            pageNum = int(request.args.get('pageNum', 1))
          
            # 查询所有的服务记录
            service_records = ServiceRecord.query.limit(offset).offset((pageNum - 1) * offset).all()

            # 构造返回数据
            subscriptions = []
            for record in service_records:
                # 获取用户地址信息
                user_address = Address.query.get(record.aid)
                if not user_address:
                    continue  # 跳过不存在地址的记录

                # 获取地址详情
                building = user_address.building
                unit = user_address.unit
                room = user_address.room

                service_name = ""
                detail = ""
                time = record.time
                srid = record.srid
                if record.sid:
                    service = Service.query.get(record.sid)
                    if service:
                        service_name = service.name
                        detail = service.detail.decode() if service.detail else ""
                        fixed_service = FixedService.query.filter_by(sid=record.sid).first()
                        if fixed_service:
                            detail = fixed_service.location
                        ondoor_service = OndoorService.query.filter_by(sid=record.sid).first()
                        if ondoor_service:
                            detail = ondoor_service.line

                subscription_data = {
                    "srid": srid,
                    "building": building,
                    "unit": unit,
                    "room": room,
                    "name": user_address.user.name if user_address.user else "",
                    "service_name": service_name,
                    "phone": user_address.user.phone if user_address.user else "",
                    "line": ondoor_service.line if ondoor_service else "",
                    "detail": detail,
                    "time": time
                }
                subscriptions.append(subscription_data)
                
            total_subscribes = ServiceRecord.query.count()
            total_pages = (total_subscribes + offset - 1) // offset

            return jsonify(code=200, data={"subscriptions": subscriptions, "total_pages": total_pages},
                           message="All subscriptions retrieved successfully"), 200
        except Exception as e:
            return jsonify(code=500, message=f"An error occurred while retrieving all subscriptions: {str(e)}"), 500

    @service_bp.route('/services/subscribe/<int:srid>', methods=['GET'])
    @jwt_required()
    def get_subscribe(srid):
        try:
            # 查询记录
            record = ServiceRecord.query.get(srid)
            if not record:
                return jsonify(code=404, message="未找到服务记录"), 404

            # 获取用户地址信息
            user_address = Address.query.get(record.aid)
            if not user_address:
                return jsonify(code=404, message="未找到服务记录"), 404

            # 获取地址详情
            building = user_address.building
            unit = user_address.unit
            room = user_address.room
            
            # 查询用户
            user = User.query.get(user_address.uid)
            
            # 获取用户头像
            avator = user.avator

            service_name = ""
            detail = ""
            cover = ""
            time = record.time
            srid = record.srid
            if record.sid:
                service = Service.query.get(record.sid)
                if service:
                    service_name = service.name
                    cover = service.cover
                    detail = service.detail.decode() if service.detail else ""
                    fixed_service = FixedService.query.filter_by(sid=record.sid).first()
                    if fixed_service:
                        detail = fixed_service.location
                    ondoor_service = OndoorService.query.filter_by(sid=record.sid).first()
                    if ondoor_service:
                        detail = ondoor_service.line

            response_data = {
                "srid": srid,
                "avator": avator,
                "cover": cover,
                "building": building,
                "unit": unit,
                "room": room,
                "name": user_address.user.name if user_address.user else "",
                "service_name": service_name,
                "phone": user_address.user.phone if user_address.user else "",
                "line": ondoor_service.line if ondoor_service else "",
                "detail": detail,
                "time": time
            }

            return jsonify(code=200, data=response_data, message="服务获取成功"), 200
        except Exception as e:
            return jsonify(code=500, message=f"获取服务时出现错误: {str(e)}"), 500

    return service_bp