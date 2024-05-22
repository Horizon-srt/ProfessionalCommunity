from flask import Flask
from flask_cors import CORS

from exts import db
from route.ebook_route import create_ebook_router
from route.guide_route import create_guide_router
from route.hire_route import create_hire_router
from route.notify_route import create_notify_router
from route.resource_route import create_resource_router
from route.service_route import create_service_router
from route.user_route import create_user_router
from flask_jwt_extended import JWTManager

# Create a Flask application instance
app = Flask(__name__)

app.config['JWT_SECRET_KEY'] = 'super-secret'
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = 2592000
jwt = JWTManager(app)

# 设置数据库连接
# app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://root:liunb0905@localhost:3306/professional'
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:liunb0905@localhost:3306/professional?charset=utf8mb4'
db.init_app(app)

# 创建蓝图
user_bp = create_user_router()
guide_bp = create_guide_router()
service_bp = create_service_router()
notify_bp = create_notify_router()
ebook_bp = create_ebook_router()
hire_bp = create_hire_router()
resource_bp = create_resource_router()

# 注册蓝图
app.register_blueprint(user_bp)
app.register_blueprint(guide_bp)
app.register_blueprint(service_bp)
app.register_blueprint(notify_bp)
app.register_blueprint(ebook_bp)
app.register_blueprint(hire_bp)
app.register_blueprint(resource_bp)

# 使用CORS扩展处理跨域请求
CORS(app)

# 运行Flask应用
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
