from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from sqlalchemy import desc

from exts import db
from model.service import Guide


def create_guide_router():
    guide_bp = Blueprint('gu    ide_bp', __name__)

    @guide_bp.route('/guides', methods=['POST'])
    @jwt_required()
    def add_guide():
        uid = get_jwt_identity()  # 获取当前用户的ID作为外键
        data = request.json
        author = data.get('author')
        title = data.get('title')
        content = data.get('content').encode()
        date = data.get('date')
        cover = data.get('cover').encode()

        new_guide = Guide(
            author=author,
            title=title,
            content=content,
            date=date,
            cover=cover,
            uid=uid
        )

        try:
            db.session.begin()
            db.session.add(new_guide)
            db.session.commit()
            return jsonify(code=200, data={'gid': new_guide.gid}, message="Guide added successfully"), 200
        except Exception as e:
            db.session.rollback()
            return jsonify(code=500, message=f"An error occurred while adding the guide: {str(e)}"), 500

    @guide_bp.route('/guides/<int:gid>', methods=['DELETE'])
    @jwt_required()
    def delete_guide(gid):
        try:
            db.session.begin()  # 开始事务
            guide = Guide.query.get(gid)
            if not guide:
                return jsonify(code=404, message="Guide not found"), 404

            db.session.delete(guide)
            db.session.commit()
            return jsonify(code=200, data={'gid': gid}, message="Guide deleted successfully"), 200
        except Exception as e:
            db.session.rollback()
            return jsonify(code=500, message=f"An error occurred while deleting the guide: {str(e)}"), 500

    @guide_bp.route('/guides/<int:gid>', methods=['PATCH'])
    @jwt_required()
    def update_guide(gid):
        try:
            db.session.begin()
            data = request.json

            # 获取要更新的指南对象
            guide = Guide.query.get(gid)
            if not guide:
                return jsonify(code=404, message="Guide not found"), 404

            # 更新指南信息
            if 'author' in data:
                guide.author = data['author']
            if 'title' in data:
                guide.title = data['title']
            if 'content' in data:
                guide.content = data['content'].encode()
            if 'date' in data:
                guide.date = data['date']
            if 'cover' in data:
                guide.cover = data['cover'].encode()

            db.session.commit()

            # 构造返回数据
            response_data = {
                "gid": guide.gid,
                "author": guide.author,
                "title": guide.title,
                "content": guide.content.decode(),
                "date": guide.date,
                "cover": guide.cover.decode()
            }

            return jsonify(code=200, data=response_data, message="Guide updated successfully"), 200
        except Exception as e:
            db.session.rollback()
            return jsonify(code=500, message=f"An error occurred while updating the guide: {str(e)}"), 500

    @guide_bp.route('/guides', methods=['GET'])
    @jwt_required()
    def get_all_guides():
        try:
            data = request.json
            # 解析请求参数
            offset = int(data['offset'])
            pageNum = int(data['pageNum'])

            # 查询指南并分页
            guides = Guide.query.limit(offset).offset((pageNum - 1) * offset).all()

            # 构造返回数据
            guides_data = []
            for guide in guides:
                guide_data = {
                    "gid": guide.gid,
                    "author": guide.author,
                    "title": guide.title,
                    "content_slice": guide.content.decode()[:50],  # 取节选，例如前50个字符
                    "cover": guide.cover.decode(),
                    "date": guide.date  # 直接使用时间戳
                }
                guides_data.append(guide_data)

            # 查询总页数
            total_guides = Guide.query.count()
            total_pages = (total_guides + offset - 1) // offset

            return jsonify(code=200, data={"guides": guides_data, "allPages": total_pages},
                           message="All guides retrieved successfully"), 200
        except Exception as e:
            return jsonify(code=500, message=f"An error occurred while retrieving all guides: {str(e)}"), 500

    @guide_bp.route('/guides/<int:gid>', methods=['GET'])
    @jwt_required()
    def get_guide_by_id(gid):
        try:
            # 查询指定gid的指南
            guide = Guide.query.get(gid)

            # 如果指南不存在，返回404错误
            if not guide:
                return jsonify(code=404, message="Guide not found"), 404

            # 构造返回数据
            guide_data = {
                "gid": guide.gid,
                "author": guide.author,
                "title": guide.title,
                "content": guide.content.decode(),
                "date": guide.date,  # 时间戳形式
                "cover": guide.cover.decode()
            }

            return jsonify(code=200, data=guide_data, message="Guide retrieved successfully"), 200
        except Exception as e:
            return jsonify(code=500, message=f"An error occurred while retrieving the guide: {str(e)}"), 500

    return guide_bp
