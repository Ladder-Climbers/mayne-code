from flask_restful import Resource
from auth.tjw_auth import *
from utils.args_decorators import args_required_method
from utils.make_result import make_result
from utils.password_check import password_check
from data.config import Statics
from data.database import db
import exceptions

args_selector = reqparse.RequestParser() \
    .add_argument("limit", type=int, required=False, location=["args", ]) \
    .add_argument("offset", type=int, required=False, location=["args", ])
