from exts import db
from model.service import Ebook


class User(db.Model):
    __tablename__ = 'user'
    uid = db.Column(db.Integer, primary_key=True)
    password = db.Column(db.String(255), nullable=False)
    name = db.Column(db.String(255), nullable=False)
    email = db.Column(db.String(255), nullable=False)
    phone = db.Column(db.String(255), nullable=True)
    avator = db.Column(db.LargeBinary, nullable=True)
    # Relationships
    addresses = db.relationship('Address', backref='user', lazy=True)
    ebooks = db.relationship('Ebook', backref='user', lazy='dynamic')
    guides = db.relationship('Guide', backref='user', lazy='dynamic')
    hires = db.relationship('Hire', backref='user', lazy='dynamic')
    notifies = db.relationship('Notify', backref='user', lazy='dynamic')
    reading_records = db.relationship('ReadingRecord', backref='user', lazy='dynamic')
    resumes = db.relationship('Resume', backref='user', lazy='dynamic')
    admin = db.relationship('Admin', backref='user', uselist=False)


class NormalUser(db.Model):
    __tablename__ = 'normal_user'
    uid = db.Column(db.Integer, db.ForeignKey('user.uid'), primary_key=True)
    status = db.Column(db.String(255), nullable=True)
    proof = db.Column(db.LargeBinary, nullable=True)


class EnterpriseUser(db.Model):
    __tablename__ = 'enterprise_user'
    uid = db.Column(db.Integer, db.ForeignKey('user.uid'), primary_key=True)
    ename = db.Column(db.String(255), nullable=True)
    description = db.Column(db.LargeBinary, nullable=True)
    cover = db.Column(db.LargeBinary, nullable=True)


class Admin(db.Model):
    __tablename__ = 'admin'
    uid = db.Column(db.Integer, db.ForeignKey('user.uid'), primary_key=True)


class Hire(db.Model):
    __tablename__ = 'hire'
    hid = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=True)
    content = db.Column(db.LargeBinary, nullable=True)
    start_time = db.Column(db.String(255), nullable=True)
    end_time = db.Column(db.String(255), nullable=True)
    status = db.Column(db.String(255), nullable=True)
    uid = db.Column(db.Integer, db.ForeignKey('user.uid'))
    # Relationships
    resumes = db.relationship('Resume', backref='hire', lazy=True)


class Resume(db.Model):
    __tablename__ = 'resume'
    resume_id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.LargeBinary, nullable=True)
    position = db.Column(db.String(255), nullable=True)
    hid = db.Column(db.Integer, db.ForeignKey('hire.hid'))
    uid = db.Column(db.Integer, db.ForeignKey('user.uid'))


class Chat(db.Model):
    __tablename__ = 'chat'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    uid = db.Column(db.Integer, db.ForeignKey('user.uid'), nullable=True)
    from_user = db.Column(db.Integer, nullable=True, comment='消息谁发的 0是user 1是chat')
    content = db.Column(db.String(255), nullable=True)

    # Relationship to User model
    user = db.relationship('User', backref=db.backref('chats', lazy=True))