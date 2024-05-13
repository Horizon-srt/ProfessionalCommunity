from random import sample

from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity

from exts import db
from model.service import Ebook, LabelEbook, ReadingRecord


def create_ebook_router():
    ebook_bp = Blueprint('ebook_bp', __name__)

    @ebook_bp.route('/education/ebook', methods=['POST'])
    @jwt_required()
    def add_ebook():
        try:
            db.session.begin()

            data = request.json

            name = data.get('name')
            description = data.get('description')
            detail = data.get('detail')
            content = data.get('content')
            cover = data.get('cover')
            labels = data.get('label', [])

            # 获取当前用户的uid
            current_user_id = get_jwt_identity()

            ebook = Ebook(
                name=name,
                description=description,
                detail=detail,
                content=content.encode(),
                cover=cover.encode(),
                uid=current_user_id
            )

            db.session.add(ebook)
            db.session.commit()

            if labels:
                for label in labels:
                    label_entry = LabelEbook(bid=ebook.bid, label=label)
                    db.session.add(label_entry)
                db.session.commit()

            response_data = {
                'bid': ebook.bid
            }

            return jsonify(code=200, data=response_data, message="Ebook added successfully"), 200
        except Exception as e:
            db.session.rollback()
            return jsonify(code=404, message=f"An error occurred while adding the ebook: {str(e)}"), 500

    @ebook_bp.route('/education/ebook/<int:bid>', methods=['DELETE'])
    @jwt_required()
    def delete_ebook(bid):
        try:
            db.session.begin()

            # Check if the ebook exists
            ebook = Ebook.query.get(bid)
            if not ebook:
                return jsonify(code=404, message="Ebook not found"), 404

            # Delete reading records associated with the ebook
            ReadingRecord.query.filter_by(bid=bid).delete()

            # Delete labels associated with the ebook
            LabelEbook.query.filter_by(bid=bid).delete()

            # Delete the ebook
            db.session.delete(ebook)
            db.session.commit()

            return jsonify(code=200, data={'bid': bid}, message="Ebook deleted successfully"), 200
        except Exception as e:
            db.session.rollback()
            return jsonify(code=404, message=f"An error occurred while deleting the ebook: {str(e)}"), 500

    @ebook_bp.route('/education/ebook/<int:bid>', methods=['PATCH'])
    @jwt_required()
    def update_ebook(bid):
        try:
            db.session.begin()

            ebook = Ebook.query.get(bid)
            if not ebook:
                return jsonify(code=404, message="Ebook not found"), 404

            data = request.json

            if 'name' in data:
                ebook.name = data['name']
            if 'description' in data:
                ebook.description = data['description']
            if 'detail' in data:
                ebook.detail = data['detail']
            if 'content' in data:
                ebook.content = data['content'].encode() if data['content'] else None
            if 'cover' in data:
                ebook.cover = data['cover'].encode() if data['cover'] else None

            # 更新标签
            if 'label' in data:
                # 删除现有标签
                LabelEbook.query.filter_by(bid=bid).delete()
                db.session.commit()

                labels = data['label']
                if labels:
                    for label in labels:
                        label_entry = LabelEbook(bid=bid, label=label)
                        db.session.add(label_entry)
                    db.session.commit()

            db.session.commit()

            response_data = {
                'bid': ebook.bid,
                'name': ebook.name,
                'description': ebook.description,
                'detail': ebook.detail,
                'content': ebook.content.decode() if ebook.content else None,
                'cover': ebook.cover.decode() if ebook.cover else None,
                'label': [label.label for label in LabelEbook.query.filter_by(bid=bid)]
            }

            return jsonify(code=200, data=response_data, message="Ebook information updated successfully"), 200
        except Exception as e:
            db.session.rollback()
            return jsonify(code=404, message=f"An error occurred while updating ebook information: {str(e)}"), 500

    @ebook_bp.route('/education/ebook/search/label', methods=['GET'])
    @jwt_required()
    def search_ebook_by_label():
        try:
            # Retrieving parameters from URL query string
            labels = request.args.get('labels')
            offset = int(request.args.get('offset', 0))
            pageNum = int(request.args.get('pageNum', 1))

            query = db.session.query(Ebook).join(LabelEbook, Ebook.bid == LabelEbook.bid)

            if labels:
                query = query.filter(LabelEbook.label.in_(labels))

            total_count = query.count()
            allPages = (total_count + offset - 1) // offset if offset else 0
            ebooks = query.limit(offset).offset((pageNum - 1) * offset).all()

            response_data = {
                'ebooks': [{
                    'bid': ebook.bid,
                    'name': ebook.name,
                    'description': ebook.description.decode(),
                    'cover': ebook.cover.decode() if ebook.cover else None,
                    'label': [label.label for label in LabelEbook.query.filter_by(bid=ebook.bid)]
                } for ebook in ebooks],
                'allPages': allPages
            }

            return jsonify(code=200, data=response_data, message="Ebooks retrieved successfully"), 200
        except Exception as e:
            return jsonify(code=404, message=f"An error occurred while retrieving ebooks: {str(e)}"), 500

    # 查询所有包含特定书名的书籍（模糊搜索）
    @ebook_bp.route('/education/ebook/search/name', methods=['GET'])
    @jwt_required()
    def search_ebook_by_name():
        try:
            name = request.args.get('name', '')
            offset = int(request.args.get('offset', 10))
            pageNum = int(request.args.get('pageNum', 1))

            # Querying the database with a case-insensitive like search on the book name
            ebooks_query = Ebook.query.filter(Ebook.name.ilike(f'%{name}%')).paginate(page=pageNum, per_page=offset,
                                                                                      error_out=False)
            ebooks = ebooks_query.items
            total_count = ebooks_query.total

            # Constructing the response data
            ebook_list = []
            for ebook in ebooks:
                # Querying for book labels
                label_records = LabelEbook.query.filter_by(bid=ebook.bid).all()
                label_list = [label_record.label for label_record in label_records]

                ebook_info = {
                    'bid': str(ebook.bid),
                    'name': ebook.name,
                    'description': ebook.description.decode() if ebook.description else None,
                    'cover': ebook.cover.decode() if ebook.cover else None,
                    'label': label_list
                }
                ebook_list.append(ebook_info)

            allPages = (total_count + offset - 1) // offset if offset else 0

            return jsonify(code=200, data={'ebooks': ebook_list, 'allPages': allPages}, message="Query successful"), 200
        except Exception as e:
            return jsonify(code=404, message=f"An error occurred while searching ebooks by name: {str(e)}"), 500

    @ebook_bp.route('/education/ebook/search/recommand', methods=['GET'])
    @jwt_required()
    def recommend_ebooks():
        try:
            offset = int(request.args.get('offset', 0))
            page_num = int(request.args.get('pageNum', 1))
            per_page = offset

            # Query ebooks
            all_ebooks = Ebook.query.all()

            # Select 10 random ebooks
            random_ebooks = sample(all_ebooks, 10)

            # Pagination
            start_index = (page_num - 1) * per_page
            end_index = start_index + per_page
            paginated_ebooks = random_ebooks[start_index:end_index]

            # Construct response data
            ebooks_data = []
            for ebook in paginated_ebooks:
                ebook_data = {
                    'bid': ebook.bid,
                    'name': ebook.name,
                    'description': ebook.description.decode(),
                    'cover': ebook.cover.decode(),
                    'label': [label.label for label in ebook.labels]
                }
                ebooks_data.append(ebook_data)

            response_data = {
                'ebooks': ebooks_data,
                'allPages': len(random_ebooks) // per_page
            }

            return jsonify(code=200, data=response_data, message="Successfully retrieved recommended ebooks"), 200

        except Exception as e:
            return jsonify(code=500, message=f"An error occurred while retrieving recommended ebooks: {str(e)}"), 500

    @ebook_bp.route('/education/ebook/<int:bid>', methods=['GET'])
    @jwt_required()
    def get_ebook(bid):
        try:
            # 查询电子书信息
            ebook = Ebook.query.get(bid)

            if not ebook:
                return jsonify(code=404, message="Ebook not found"), 404

            # 查询关联的标签
            labels = [label.label for label in LabelEbook.query.filter_by(bid=bid).all()]

            # 构造响应数据
            response_data = {
                'bid': ebook.bid,
                'name': ebook.name,
                'description': ebook.description,
                'detail': ebook.detail,
                'content': ebook.content.decode(),
                'cover': ebook.cover.decode(),
                'label': labels
            }

            return jsonify(code=200, data=response_data, message="Ebook retrieved successfully"), 200
        except Exception as e:
            return jsonify(code=404, message=f"An error occurred while retrieving the ebook: {str(e)}"), 500

    return ebook_bp
