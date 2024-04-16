from flask import Blueprint, jsonify, request
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required

from model.address import Address

from exts import db
from model.user import User, NormalUser, EnterpriseUser, Admin
from route.utils import check_user_role


def create_user_router():
    user_bp = Blueprint('user_bp', __name__)

    @user_bp.route('/register/normal', methods=['POST'])
    def register_normal():
        data = request.json

        try:
            # 开启事务
            db.session.begin()

            # 检查用户是否已存在
            if User.query.filter((User.email == data['email']) | (User.phone == data['phone'])).first():
                return jsonify(code=404, message="Email or phone number has been registered"), 404

            # 创建用户
            new_user = User(
                name=data['name'],
                email=data['email'],
                phone=data['phone'],
                password=data['password'],  # 注意密码哈希处理
                avator=(data['avator']).encode() if 'avator' in data else None
            )
            db.session.add(new_user)
            db.session.flush()

            # 创建地址信息
            new_address = Address(
                building=data['building'],
                unit=data['unit'],
                room=data['room'],
                uid=new_user.uid
            )
            db.session.add(new_address)

            # 创建普通用户额外信息
            normal_user = NormalUser(
                uid=new_user.uid,
                proof=data['proof'].encode() if 'proof' in data else None
            )
            db.session.add(normal_user)

            # 生成访问令牌
            access_token = create_access_token(identity=new_user.uid)

            # 提交事务
            db.session.commit()

            return jsonify(code=200, data={'jwt': access_token, 'uid': new_user.uid, "type": "NORMAL"},
                           message="User registration successful")

        except Exception as e:
            # 回滚事务
            db.session.rollback()
            # 返回错误信息
            return jsonify(code=404, message=str(e))

    @user_bp.route('/register/admin', methods=['POST'])
    def register_admin():
        data = request.json
        try:
            db.session.begin()

            # 检查用户名是否已被注册
            if User.query.filter_by(name=data['name']).first():
                return jsonify(code=404, message='Username already exists'), 404

            # 创建新用户
            new_user = User(
                name=data['name'],
                password=data['password'],
                email=data['email'],
                phone=data['phone'],
                avator=data['avator'].encode()
            )

            # 将新用户添加到数据库
            db.session.add(new_user)
            db.session.flush()

            # 创建新管理员
            new_admin = Admin(uid=new_user.uid)
            db.session.add(new_admin)

            db.session.commit()

            return jsonify(code=200, message='Admin registered successfully',
                           data={'name': new_user.name, 'avator': new_user.avator.decode()}), 200

        except Exception as e:
            # 回滚事务
            db.session.rollback()
            # 返回错误信息
            return jsonify(code=500, message="An error occurred while registering admin: " + str(e)), 500

    @user_bp.route('/register/enterprise', methods=['POST'])
    def register_enterprise():
        data = request.json
        try:
            db.session.begin()

            # 检查用户是否已存在
            if User.query.filter((User.email == data['email']) | (User.phone == data['phone'])).first():
                return jsonify(code=404, message="邮箱或电话已被注册"), 404

            # 创建新用户
            new_user = User(
                name=data['name'],
                email=data['email'],
                phone=data['phone'],
                password=data['password'],
                avator=data.get('avator').encode()
            )
            db.session.add(new_user)
            db.session.commit()

            # 添加企业用户额外信息
            enterprise_user = EnterpriseUser(
                uid=new_user.uid,
                ename=data['ename'],
                description=data['description'].encode(),
                cover=data['cover'].encode()
            )
            db.session.add(enterprise_user)
            db.session.commit()

            return jsonify(code=200,
                           data={'name': new_user.name, 'ename': enterprise_user.ename, 'avator': new_user.avator.decode()},
                           message="Enterprise user registration successful")

        except Exception as e:
            # 回滚事务
            db.session.rollback()
            # 返回错误信息
            return jsonify(code=500, message="An error occurred while registering enterprise user: " + str(e)), 500

    @user_bp.route('/login', methods=['GET'])
    def login():
        data = request.json
        user = User.query.filter_by(email=data['account']).first()

        # 检查账号是否存在
        if not user:
            user = User.query.filter_by(phone=data['account']).first()
            if not user:
                return jsonify(code=404, message="账号不存在"), 404

        # 检查密码是否正确
        if user.password != data['password']:
            return jsonify(code=404, message="密码错误"), 404

        # 账号存在且密码正确，生成JWT
        access_token = create_access_token(identity=user.uid)

        # 检查用户角色
        user_role = check_user_role(user.uid)

        return jsonify(code=200, data={'jwt': access_token, 'uid': user.uid, 'role': user_role}, message="登录成功")

    @user_bp.route('/users/<int:uid>', methods=['GET'])
    @jwt_required()
    def get_user_info(uid):
        # 验证 JWT，获取当前用户 ID
        current_user_id = get_jwt_identity()

        # 检查当前用户是否有权限获取目标用户信息
        if current_user_id != uid:
            return jsonify({"msg": "Unauthorized"}), 404

        # 查询基础用户信息
        user = User.query.get(uid)
        if not user:
            return jsonify({"msg": "User not found"}), 404

        # 构建基础用户信息字典
        user_info = {
            "uid": user.uid,
            "name": user.name,
            "email": user.email,
            "phone": user.phone,
            "avator": user.avator.decode()
        }

        # 查询普通用户信息
        normal_user = NormalUser.query.get(uid)
        if normal_user:
            user_info.update({
                "status": normal_user.status,
            })

        # 查询企业用户信息
        enterprise_user = EnterpriseUser.query.get(uid)
        if enterprise_user:
            user_info.update({
                "ename": enterprise_user.ename,
            })

        return jsonify(code=200, data=user_info), 200

    @user_bp.route('/users/<int:uid>', methods=['DELETE'])
    @jwt_required()
    def delete_user(uid):
        try:
            db.session.begin()

            # 验证 JWT，获取当前用户 ID
            current_user_id = get_jwt_identity()

            # 检查用户角色
            user_role = check_user_role(current_user_id)

            # 获取用户信息
            user = User.query.get(uid)
            if not user:
                return jsonify(code=404, message="User not found"), 404

            if user_role == "ADMIN":
                admin_user = Admin.query.get(uid)
                if admin_user:
                    db.session.delete(admin_user)
            elif user_role == "ENTERPRISE":
                enterprise_user = EnterpriseUser.query.get(uid)
                if enterprise_user:
                    db.session.delete(enterprise_user)
            else:
                normal_user = NormalUser.query.filter_by(uid=uid).first()
                if normal_user:
                    db.session.delete(normal_user)

            # 最后删除用户
            db.session.delete(user)
            db.session.commit()

        except Exception as e:
            db.session.rollback()
            return jsonify(code=500, message=f"An error occurred while deleting user: {str(e)}"), 500

        return jsonify(code=200, data={"uid": uid}), 200

    @user_bp.route('/users/<int:uid>', methods=['PATCH'])
    @jwt_required()
    def update_user(uid):
        try:
            # 开始事务
            db.session.begin()

            # 验证 JWT，获取当前用户 ID
            current_user_id = get_jwt_identity()

            # 获取用户信息
            user = User.query.get(uid)
            if not user:
                return jsonify(code=404, message="User not found"), 404

            # 解析请求参数
            params = request.json

            # 检查用户角色
            user_role = check_user_role(current_user_id)

            # 更新用户信息
            if 'name' in params:
                user.name = params['name']
            if 'email' in params:
                user.email = params['email']
            if 'phone' in params:
                user.phone = params['phone']
            if 'avator' in params:
                user.avator = params['avator'].encode()
            if 'password_pre' in params and 'password_cur' in params:
                if user.password == params['password_pre']:
                    user.password = params['password_cur']
                else:
                    db.session.rollback()
                    return jsonify(code=400, message="Incorrect previous password"), 400
            if user_role == "ADMIN":
                if 'status' in params:
                    normal_user = NormalUser.query.get(uid)
                    if normal_user:
                        normal_user.status = params['status']
            if user_role == "ENTERPRISE" and 'ename' in params:
                enterprise_user = EnterpriseUser.query.get(uid)
                if enterprise_user:
                    enterprise_user.ename = params['ename']

            db.session.commit()

            # 构造返回数据
            response_data = {
                "uid": user.uid,
                "name": user.name,
                "email": user.email,
                "phone": user.phone,
                "avator": user.avator.decode(),
                "status": getattr(normal_user, 'status', None) if user_role == "Admin" else None,
                "ename": getattr(enterprise_user, 'ename', None) if user_role == "EnterpriseUser" else None
            }

        except Exception as e:
            db.session.rollback()
            return jsonify(code=500, message=f"An error occurred while updating user: {str(e)}"), 500

        return jsonify(code=200, data=response_data), 200

    @user_bp.route('/users/all', methods=['GET'])
    @jwt_required()
    def get_all_users():
        data = request.json
        # 验证 JWT，获取当前用户 ID
        current_user_id = get_jwt_identity()

        # 获取请求参数
        offset = int(data['offset'])
        pageNum = int(data['pageNum'])

        # 查询用户列表并分页
        users_query = User.query
        users_count = users_query.count()
        users = users_query.limit(offset).offset((pageNum - 1) * offset).all()

        # 构造返回数据
        all_users = []
        for user in users:
            user_data = {
                "uid": user.uid,
                "name": user.name,
                "status": None,
                "ename": None
            }
            user_role = check_user_role(current_user_id)
            if user_role == "NormalUser":
                normal_user = NormalUser.query.get(user.uid)
                if normal_user:
                    user_data["status"] = normal_user.status
            elif user_role == "EnterpriseUser":
                enterprise_user = EnterpriseUser.query.get(user.uid)
                if enterprise_user:
                    user_data["ename"] = enterprise_user.ename
            all_users.append(user_data)

        allPages = (users_count + offset - 1) // offset

        response_data = {
            "users": all_users,
            "allPages": allPages
        }

        return jsonify(code=200, data=response_data), 200

    @user_bp.route('/users/re_verify/<int:uid>', methods=['PATCH'])
    @jwt_required()
    def re_verify_user(uid):
        # 验证 JWT，获取当前用户 ID
        current_user_id = get_jwt_identity()

        # # 根据当前用户角色检查权限
        # user_role = check_user_role(current_user_id)
        # if user_role != "Admin":
        #     return jsonify(code=403, message="Permission denied"), 403

        # 查询用户
        user = User.query.get(uid)
        if not user:
            return jsonify(code=404, message="User not found"), 404

        # 更新审核状态为 pending
        normal_user = NormalUser.query.get(uid)
        if normal_user:
            normal_user.status = "pending"
            db.session.commit()

        return jsonify(code=200, data={"uid": uid}), 200

    return user_bp
