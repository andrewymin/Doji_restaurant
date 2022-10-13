import pandas as pd
from sqlalchemy import Column, Integer, String, VARCHAR
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import create_engine

Base = declarative_base()


class Menu(Base):
    # Tell SQLAlchemy what the table name is and if there's any table-specific arguments it should know about
    __tablename__ = 'menu'
    __table_args__ = {'sqlite_autoincrement': True}
    # tell SQLAlchemy the name of column and its attributes:
    id = Column(Integer, primary_key=True, nullable=False)
    category = Column(String(40))
    name = Column(VARCHAR)
    description = Column(Integer)
    price = Column(Integer)
    option2 = Column(VARCHAR)
    price2 = Column(Integer)
    img = Column(String(50))


engine = create_engine('sqlite:///menu.db')


Base.metadata.create_all(engine)
file_name = 'menu.csv'
df = pd.read_csv(file_name)
df.to_sql(con=engine, index_label='id', name='menu', if_exists='replace')