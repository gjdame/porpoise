#!/usr/bin/python3
from os import getenv
from sqlalchemy import create_engine, MetaData
from sqlalchemy.orm import sessionmaker, scoped_session
from loginmodel import UserCred
from loginmodel import Base

class DBStorage:
    '''
        Create SQLalchemy database
    '''
    __engine = None
    __session = None

    def __init__(self):
        '''
            Create engine and link to MySQL databse (hbnb_dev, hbnb_dev_db)
        '''
        #user = getenv("USER")
        #pwd = getenv("PWD")
        #host = getenv("HOST")
        #db = getenv("DB")
        envv = getenv("HBNB_ENV", "none")
        user = 'greg'
        pwd = 'gregpassword'
        host = 'localhost'
        db = 'porpoise'

        self.__engine = create_engine('mysql+mysqldb://{}:{}@{}/{}'.format(
            user, pwd, host, db), pool_pre_ping=True)
        if envv == 'test':
            Base.metadata.drop_all(self.__engine)

    def all(self):
        '''
            Query current database session
        '''
        db_dict = {}

        objs = self.__session.query(UserCred).all()
        for obj in objs:
            key = "{}.{}".format(obj.__class__.__name__, obj.id)
            db_dict[key] = obj
        return db_dict

    def new(self, obj):
        '''
            Add object to current database session
        '''
        self.__session.add(obj)

    def save(self):
        '''
            Commit all changes of current database session
        '''
        self.__session.commit()

    def delete(self, obj=None):
        '''
            Delete from current database session
        '''
        if obj is not None:
            self.__session.delete(obj)

    def reload(self):
        '''
            Commit all changes of current database session
        '''
        self.__session = Base.metadata.create_all(self.__engine)
        factory = sessionmaker(bind=self.__engine, expire_on_commit=False)
        Session = scoped_session(factory)
        self.__session = Session()

    def close(self):
        '''
            Remove private session attribute
        '''
        self.__session.close()

    def count(self, cls=None):
        ''' counts all the instances of a class '''
        return len(self.all(cls))

    @property
    def session(self):
        return self.__session

    def get(self, id):
        '''
        returns object based on class name and id. Otherwise none
        cls: string representing the class name
        id: string representing the object ID
        '''
        try:
            return [a for a in self.all(UserCred).values() if a.urlhash == id][0]
        except (IndexError, TypeError):
            return None