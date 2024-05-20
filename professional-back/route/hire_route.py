from datetime import datetime
from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity

from exts import db
from model.user import Hire, Resume, EnterpriseUser, Admin, User


def create_hire_router():
    hire_bp = Blueprint('hire_bp', __name__, url_prefix='/api')

    @hire_bp.route('/hires/create', methods=['POST'])
    @jwt_required()
    def add_hire():
        try:
            db.session.begin()

            data = request.json

            # 解析请求数据
            title = data.get('title')
            content = data.get('content')
            start_time = data.get('start_time')
            end_time = data.get('end_time')

            # 创建 Hire 对象并添加到数据库
            hire = Hire(
                title=title,
                content=content.encode(),
                start_time=start_time,
                end_time=end_time,
                uid=get_jwt_identity(),
                status='pending'
            )

            db.session.add(hire)
            db.session.commit()

            # 构造响应数据
            response_data = {
                'hid': hire.hid
            }

            return jsonify(code=200, data=response_data, message="Hire information added successfully"), 200
        except Exception as e:
            # 出现异常时回滚数据库会话
            db.session.rollback()
            # 返回错误响应
            return jsonify(code=404, message=f"An error occurred while adding the hire information: {str(e)}"), 500

    @hire_bp.route('/hires/<int:hid>', methods=['DELETE'])
    @jwt_required()
    def delete_hire(hid):
        try:
            db.session.begin()

            # Check if the hire exists
            hire = Hire.query.get(hid)
            if not hire:
                return jsonify(code=404, message="Hire not found"), 404

            # Delete associated resumes
            Resume.query.filter_by(hid=hid).delete()

            # Delete the hire
            db.session.delete(hire)
            db.session.commit()

            # Construct response data
            response_data = {
                'hid': hid
            }

            return jsonify(code=200, data=response_data, message="Hire deleted successfully"), 200
        except Exception as e:
            db.session.rollback()
            return jsonify(code=404, message=f"An error occurred while deleting the hire: {str(e)}"), 500

    @hire_bp.route('/hires/<int:hid>', methods=['PATCH'])
    @jwt_required()
    def update_hire(hid):
        try:
            current_user_id = get_jwt_identity()

            db.session.begin()

            # Check if the hire exists
            hire = Hire.query.get(hid)
            if not hire:
                return jsonify(code=404, message="Hire not found"), 404

            # Update hire attributes if provided in the request
            data = request.json
            if 'title' in data:
                hire.title = data['title']
            if 'content' in data:
                hire.content = data['content'].encode()
            if 'start_time' in data:
                hire.start_time = data['start_time']
            if 'end_time' in data:
                hire.end_time = data['end_time']
            if 'status' in data:
                # Check if the current user is admin
                admin = Admin.query.filter_by(uid=current_user_id).first()
                if not admin:
                    return jsonify(code=404, message="You are not authorized to perform this action"), 404
                hire.status = data['status']

            db.session.commit()

            # Get the enterprise user's name associated with the hire
            ename = None
            enterprise_user = EnterpriseUser.query.filter_by(uid=hire.uid).first()
            if enterprise_user:
                ename = enterprise_user.ename

            # Construct response data
            response_data = {
                'hid': hid,
                'ename': ename,
                'title': hire.title,
                'content': hire.content.decode(),
                'start_time': hire.start_time,
                'end_time': hire.end_time,
                'status': hire.status
            }

            return jsonify(code=200, data=response_data, message="Hire updated successfully"), 200
        except Exception as e:
            db.session.rollback()
            return jsonify(code=404, message=f"An error occurred while updating the hire: {str(e)}"), 500

    @hire_bp.route('/hires/all', methods=['GET'])
    @jwt_required()
    def get_all_hires():
        try:
            # 从请求中获取查询参数
            offset = int(request.args.get('offset', 0))
            pageNum = int(request.args.get('pageNum', 1))
            status = request.args.get('status', None)
            ename = request.args.get('ename', None)
            available = request.args.get('available', None)

            # 查询符合条件的招聘信息
            query = Hire.query
            if status is not None:
                query = query.filter_by(status=status)
            if ename is not None:
                # 公司名称模糊匹配查询
                enterprise_users = EnterpriseUser.query.filter(EnterpriseUser.ename.ilike(f'%{ename}%')).all()
                enterprise_uids = [enterprise_user.uid for enterprise_user in enterprise_users]
                query = query.filter(Hire.uid.in_(enterprise_uids))
            if available is not None:
                now = int(datetime.now().timestamp())
                if available == '0':
                    query = query.filter(Hire.start_time <= now, Hire.end_time >= now)
                elif available == '1':
                    query = query.filter(Hire.start_time > now)
                elif available == '2':
                    query = query.filter(Hire.end_time < now)

            # 获取符合条件的招聘信息总数
            hires_count = query.count()

            # 分页处理
            per_page = offset  # offset就是一页应该有多少数据
            hires = query.limit(per_page).offset((pageNum - 1) * per_page).all()

            # 构造返回数据
            hires_data = []
            for hire in hires:
                hires_data.append({
                    'hid': hire.hid,
                    'title': hire.title,
                    'ename': EnterpriseUser.query.get(hire.uid).ename,
                    'start_time': hire.start_time,
                    'end_time': hire.end_time,
                    'content_slice': hire.content[:50].decode(),  # 取内容的前50个字符作为节选
                    'status': hire.status
                })

            # 计算总页数
            allPages = (hires_count + offset - 1) // offset

            response_data = {
                'hires': hires_data,
                'allPages': allPages
            }

            return jsonify(code=200, data=response_data, message="Successfully retrieved all hires"), 200
        except Exception as e:
            return jsonify(code=404, message=f"An error occurred while retrieving hires: {str(e)}"), 500

    @hire_bp.route('/hires/all/<int:hid>', methods=['GET'])
    @jwt_required()
    def get_hires_by_hid(hid):
        try:
            # 查询特定hid招聘信息
            hire = Hire.query.get(hid)

            if not hire:
              return jsonify(code=404, message="Hire not found"), 404
            
            hire_data = {
              'hid': hire.hid,
              'title': hire.title,
              'ename': EnterpriseUser.query.get(hire.uid).ename,
              'start_time': hire.start_time,
              'end_time': hire.end_time,
              'content': hire.content.decode(),
              'status': hire.status
            }

            return jsonify(code=200, data=hire_data, message="Successfully retrieved hires by company"), 200
        except Exception as e:
            return jsonify(code=404, message=f"An error occurred while retrieving hires by company: {str(e)}"), 500


    @hire_bp.route('/hires/all/comp/<int:uid>', methods=['GET'])
    @jwt_required()
    def get_hires_by_company(uid):
        try:
            offset = int(request.args.get('offset', 0))
            pageNum = int(request.args.get('pageNum', 1))

            # 查询特定公司的招聘信息
            query = Hire.query.filter_by(uid=uid)

            # 获取特定公司的招聘信息总数
            hires_count = query.count()

            # 分页处理
            per_page = offset  # offset就是一页应该有多少数据
            hires = query.limit(per_page).offset((pageNum - 1) * per_page).all()

            # 构造返回数据
            hires_data = []
            for hire in hires:
                hires_data.append({
                    'hid': hire.hid,
                    'title': hire.title,
                    'ename': EnterpriseUser.query.get(hire.uid).ename,
                    'start_time': hire.start_time,
                    'end_time': hire.end_time,
                    'content_slice': hire.content[:50].decode(),  # 取内容的前50个字符作为节选
                    'status': hire.status
                })

            # 计算总页数
            allPages = (hires_count + offset - 1) // offset

            response_data = {
                'hires': hires_data,
                'allPages': allPages
            }

            return jsonify(code=200, data=response_data, message="Successfully retrieved hires by company"), 200
        except Exception as e:
            return jsonify(code=404, message=f"An error occurred while retrieving hires by company: {str(e)}"), 500

    @hire_bp.route('/resume', methods=['POST'])
    @jwt_required()
    def create_resume():
        try:
            # 从JWT中获取用户ID
            current_user_id = get_jwt_identity()

            # 从请求中获取参数
            data = request.json
            hid = data.get('hid')
            content = data.get('content')
            position = data.get('position')

            # 创建简历
            resume = Resume(
                hid=hid,
                content=content.encode(),  # 将内容编码为字节字符串存储
                position=position,
                uid=current_user_id  # 将用户ID存储到简历中
            )

            # 将简历添加到数据库会话中
            db.session.add(resume)
            db.session.commit()

            # 构造响应数据
            response_data = {
                'resume_id': resume.resume_id
            }

            return jsonify(code=200, data=response_data, message="Resume created successfully"), 200
        except Exception as e:
            # 如果出现异常，回滚数据库会话并返回错误响应
            db.session.rollback()
            return jsonify(code=404, message=f"An error occurred while creating resume: {str(e)}"), 500

    @hire_bp.route('/resume/all', methods=['GET'])
    @jwt_required()
    def get_all_resumes():
        try:
            offset = int(request.args.get('offset', 0))
            pageNum = int(request.args.get('pageNum', 1))

            # 查询简历数据
            resumes_query = (
                db.session.query(Resume, User)
                    .join(User, Resume.uid == User.uid)
                    .order_by(Resume.resume_id.desc())
            )

            # 分页处理
            per_page = offset  # offset就是一页多少数据
            resumes = resumes_query.limit(per_page).offset((pageNum - 1) * per_page).all()

            # 构造响应数据
            response_data = {
                'resumes': [{
                    'resume_id': resume.resume_id,
                    'name': user.name,
                    'position': resume.position,
                    'phone': user.phone,
                    'email': user.email,
                    'content': resume.content.decode()  # 解码内容为字符串
                } for resume, user in resumes],
                'allPages': len(resumes)  # 总页数
            }

            return jsonify(code=200, data=response_data, message="All resumes retrieved successfully"), 200
        except Exception as e:
            # 如果出现异常，返回错误响应
            return jsonify(code=404, message=f"An error occurred while retrieving resumes: {str(e)}"), 500

    @hire_bp.route('/resume/<int:resume_id>', methods=['GET'])
    @jwt_required()
    def get_resume(resume_id):
        try:
            # 查询简历数据
            resume_query = (
                db.session.query(Resume, User.name, User.phone, User.email)
                    .join(User, Resume.uid == User.uid)
                    .filter(Resume.resume_id == resume_id)
                    .first()
            )

            # 如果没有找到简历，返回404错误
            if not resume_query:
                return jsonify(code=404, message="Resume not found"), 404

            # 构造响应数据
            resume, user_name, user_phone, user_email = resume_query
            response_data = {
                'resume_id': resume.resume_id,
                'name': user_name,
                'position': resume.position,
                'phone': user_phone,
                'email': user_email,
                'content': resume.content.decode()  # 解码内容为字符串
            }

            return jsonify(code=200, data=response_data, message="Resume retrieved successfully"), 200
        except Exception as e:
            # 如果出现异常，返回404错误
            return jsonify(code=404, message=f"An error occurred while retrieving the resume: {str(e)}"), 404

    @hire_bp.route('/hires/review', methods=['GET'])
    @jwt_required()  # 需要登录
    def review_hires():
        # 获取当前用户身份
        current_user = get_jwt_identity()

        # 获取请求参数
        filter_value = request.args.get('filter')
        offset = int(request.args.get('offset', 10))  # 默认一页显示10条数据
        pageNum = int(request.args.get('pageNum', 1))  # 默认第一页

        try:
            # 根据过滤条件查询招聘信息
            query = db.session.query(Hire).join(EnterpriseUser, Hire.uid == EnterpriseUser.uid)
            if filter_value == '0':
                query = query.filter(Hire.status != 'pending')
            elif filter_value == '1':
                query = query.filter(Hire.status == 'pending')
            else:
                return jsonify({'code': 404, 'message': 'Invalid filter value'}), 404

            # 分页
            pagination = query.paginate(page=pageNum, per_page=offset, error_out=False)
            hires = pagination.items

            # 构造响应数据
            hire_list = []
            for hire in hires:
                ename = EnterpriseUser.query.get(hire.uid).ename
                hire_data = {
                    'hid': hire.hid,
                    'title': hire.title,
                    'ename': ename,
                    'status': hire.status
                }
                hire_list.append(hire_data)

            response_data = {
                'code': 200,
                'data': {
                    'hires': hire_list,
                    'allPages': pagination.pages
                }
            }
            return jsonify(response_data), 200
        except Exception as e:
            # 异常处理
            return jsonify({'code': 404, 'message': str(e)}), 404
    return hire_bp
