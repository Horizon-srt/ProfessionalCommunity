from exts import db


class Service(db.Model):
    __tablename__ = 'service'
    sid = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=True)
    cover = db.Column(db.LargeBinary, nullable=True)
    available = db.Column(db.String(255), nullable=True)
    detail = db.Column(db.LargeBinary, nullable=True)
    # Relationships
    fixed_services = db.relationship('FixedService', backref='service', uselist=False)
    ondoor_services = db.relationship('OndoorService', backref='service', uselist=False)
    service_records = db.relationship('ServiceRecord', backref='service', lazy=True)


class FixedService(db.Model):
    __tablename__ = 'fixed_service'
    sid = db.Column(db.Integer, db.ForeignKey('service.sid'), primary_key=True)
    location = db.Column(db.String(255), nullable=True)
    map = db.Column(db.String(255), nullable=True)
    video = db.Column(db.LargeBinary, nullable=True)


class OndoorService(db.Model):
    __tablename__ = 'ondoor_service'
    sid = db.Column(db.Integer, db.ForeignKey('service.sid'), primary_key=True)
    line = db.Column(db.String(255), nullable=True)


class Ebook(db.Model):
    __tablename__ = 'ebook'
    bid = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=True)
    content = db.Column(db.LargeBinary, nullable=True)
    cover = db.Column(db.LargeBinary, nullable=True)
    description = db.Column(db.String(255), nullable=True)
    detail = db.Column(db.String(255), nullable=True)
    uid = db.Column(db.Integer, db.ForeignKey('user.uid'))
    # Relationships
    reading_records = db.relationship('ReadingRecord', backref='ebook', lazy=True)


class Guide(db.Model):
    __tablename__ = 'guide'
    gid = db.Column(db.Integer, primary_key=True)
    author = db.Column(db.String(255), nullable=True)
    content = db.Column(db.LargeBinary, nullable=True)
    date = db.Column(db.String(255), nullable=True)
    title = db.Column(db.String(255), nullable=True)
    cover = db.Column(db.LargeBinary, nullable=True)
    uid = db.Column(db.Integer, db.ForeignKey('user.uid'))


class ReadingRecord(db.Model):
    __tablename__ = 'reading_record'
    rrid = db.Column(db.Integer, primary_key=True)
    page = db.Column(db.Integer, nullable=True)
    time = db.Column(db.String(255), nullable=True)
    bid = db.Column(db.Integer, db.ForeignKey('ebook.bid'))
    uid = db.Column(db.Integer, db.ForeignKey('user.uid'))


class Notify(db.Model):
    __tablename__ = 'notify'
    nid = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.LargeBinary, nullable=True)
    title = db.Column(db.String(255), nullable=True)
    time = db.Column(db.String(255), nullable=True)
    uid = db.Column(db.Integer, db.ForeignKey('user.uid'))


class LabelEbook(db.Model):
    __tablename__ = 'label_ebook'
    bid = db.Column(db.Integer, db.ForeignKey('ebook.bid'), primary_key=True)
    label = db.Column(db.String(255), primary_key=True)

    ebook = db.relationship('Ebook', backref='labels')
