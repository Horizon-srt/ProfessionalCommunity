from flask import Blueprint, jsonify, request
from flask_jwt_extended import get_jwt_identity, jwt_required

from exts import db
from model.service import Notify


def create_notify_router():
    notify_bp = Blueprint('notify_bp', __name__)

    @notify_bp.route('/notifies', methods=['POST'])
    @jwt_required()
    def add_notify():
        try:
            # 开启数据库事务
            db.session.begin()

            # 解析请求数据
            data = request.json
            title = data.get('title')
            time = data.get('time')
            content = data.get('content').encode()

            # 获取当前用户ID
            current_user_id = get_jwt_identity()

            # 创建新的公告
            new_notify = Notify(
                title=title,
                time=time,
                content=content,
                uid=current_user_id  # 根据当前用户的JWT获取其ID
            )

            # 将新的公告添加到数据库中
            db.session.add(new_notify)
            db.session.commit()

            # 构造响应数据
            response_data = {
                'nid': new_notify.nid
            }

            return jsonify(code=200, data=response_data, message="公告添加成功"), 200
        except Exception as e:
            db.session.rollback()
            return jsonify(code=500, message=f"添加公告时出现错误: {str(e)}"), 500

    @notify_bp.route('/notifies/<int:nid>', methods=['DELETE'])
    @jwt_required()
    def delete_notify(nid):
        try:
            # 开启数据库事务
            db.session.begin()

            # 查询要删除的公告
            notify = Notify.query.get(nid)
            if not notify:
                return jsonify(code=404, message="未找到要删除的公告"), 404

            # 删除公告
            db.session.delete(notify)
            db.session.commit()

            return jsonify(code=200, data={'nid': nid}, message="公告删除成功"), 200
        except Exception as e:
            db.session.rollback()
            return jsonify(code=500, message=f"删除公告时出现错误: {str(e)}"), 500

    @notify_bp.route('/notifies/<int:nid>', methods=['PATCH'])
    @jwt_required()
    def update_notify(nid):
        try:
            # 开启数据库事务
            db.session.begin()

            # 查询要修改的公告
            notify = Notify.query.get(nid)
            if not notify:
                return jsonify(code=404, message="未找到要修改的公告"), 404

            # 更新公告属性
            data = request.json
            if 'title' in data:
                notify.title = data['title']
            if 'time' in data:
                notify.time = data['time']
            if 'content' in data:
                notify.content = data['content'].encode()

            # 提交事务
            db.session.commit()

            # 构造响应数据
            response_data = {
                'nid': nid,
                'title': notify.title,
                'time': notify.time,
                'content': notify.content.decode()
            }

            return jsonify(code=200, data=response_data, message="公告修改成功"), 200
        except Exception as e:
            db.session.rollback()
            return jsonify(code=500, message=f"修改公告时出现错误: {str(e)}"), 500

    @notify_bp.route('/notifies/all', methods=['GET'])
    @jwt_required()
    def get_all_notifies():
        try:
            offset = int(request.args.get('offset', 0))
            pageNum = int(request.args.get('pageNum', 1))

            # 查询公告并分页
            total_notifies = Notify.query.count()
            notifies = Notify.query.limit(offset).offset((pageNum - 1) * offset).all()

            # 构造返回数据
            notifies_data = []
            for notify in notifies:
                notify_data = {
                    "nid": notify.nid,
                    "title": notify.title,
                    "time": notify.time,
                    "content_slice": notify.content.decode()[:50] if notify.content else ""  # 取节选，例如前50个字符
                }
                notifies_data.append(notify_data)

            # 查询总页数
            total_pages = (total_notifies + offset - 1)

            return jsonify(code=200, data={"notifies": notifies_data, "allPages": total_pages},
                           message="所有公告检索成功"), 200
        except Exception as e:
            return jsonify(code=500, message=f"检索所有公告时出现错误: {str(e)}"), 500

    @notify_bp.route('/notifies/<int:nid>', methods=['GET'])
    @jwt_required()
    def get_notify(nid):
        try:
            # 查询公告
            notify = Notify.query.get(nid)

            # 检查公告是否存在
            if not notify:
                return jsonify(code=404, message="公告未找到"), 404

            # 构造返回数据
            notify_data = {
                "nid": notify.nid,
                "title": notify.title,
                "time": notify.time,
                "content": notify.content.decode() if notify.content else ""
            }

            return jsonify(code=200, data=notify_data, message="公告检索成功"), 200
        except Exception as e:
            return jsonify(code=500, message=f"检索公告时出现错误: {str(e)}"), 500

    return notify_bp
