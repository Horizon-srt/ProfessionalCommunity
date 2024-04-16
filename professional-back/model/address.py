from exts import db


class Address(db.Model):
    __tablename__ = 'address'
    aid = db.Column(db.Integer, primary_key=True)
    building = db.Column(db.String(255), nullable=True)
    unit = db.Column(db.String(255), nullable=True)
    room = db.Column(db.String(255), nullable=True)
    uid = db.Column(db.Integer, db.ForeignKey('user.uid'))
    # Relationships
    alerts = db.relationship('Alert', backref='address', lazy=True)
    service_records = db.relationship('ServiceRecord', backref='address', lazy=True)
    resources = db.relationship('Resource', backref='address', lazy=True)


class Alert(db.Model):
    __tablename__ = 'alert'
    alert_id = db.Column(db.Integer, primary_key=True)
    type = db.Column(db.String(255), nullable=True)
    value = db.Column(db.Integer, nullable=True)
    aid = db.Column(db.Integer, db.ForeignKey('address.aid'))


class ServiceRecord(db.Model):
    __tablename__ = 'service_record'
    srid = db.Column(db.Integer, primary_key=True)
    time = db.Column(db.String(255), nullable=True)
    detail = db.Column(db.LargeBinary, nullable=True)
    sid = db.Column(db.Integer, db.ForeignKey('service.sid'))
    aid = db.Column(db.Integer, db.ForeignKey('address.aid'))


class Resource(db.Model):
    __tablename__ = 'resource'
    resource_id = db.Column(db.Integer, primary_key=True)
    type = db.Column(db.String(255), nullable=True)
    value = db.Column(db.Integer, nullable=True)
    year = db.Column(db.String(255), nullable=True)
    month = db.Column(db.String(255), nullable=True)
    aid = db.Column(db.Integer, db.ForeignKey('address.aid'))
