from model.user import NormalUser, Admin, EnterpriseUser


def check_user_role(uid):
    # 查询 NormalUser 表
    normal_user = NormalUser.query.filter_by(uid=uid).first()
    if normal_user:
        return "NORMAL"

    # 查询 Admin 表
    admin = Admin.query.filter_by(uid=uid).first()
    if admin:
        return "ADMIN"

    # 查询 EnterpriseUser 表
    enterprise_user = EnterpriseUser.query.filter_by(uid=uid).first()
    if enterprise_user:
        return "ENTERPRISE"

