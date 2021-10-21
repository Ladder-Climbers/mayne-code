from utils.api_tools import *


class SquareCommentsAPI(Resource):
    args_post = reqparse.RequestParser() \
        .add_argument("book_title", help="书名", type=str, required=True, location=["json", ]) \
        .add_argument("rating", help="评分", type=float, required=False, location=["json", ]) \
        .add_argument("content", help="评论内容", type=str, required=True, location=["json", ])
    args_get = reqparse.RequestParser() \
        .add_argument("book_title", help="书名", type=str, required=True, location=["args", ])

    @args_required_method(args_post)
    @auth_required_method
    def post(self, uid: int):
        args = self.args_post.parse_args()
        book_title, rating, content = args.get('book_title'), args.get('rating'), args.get('content')
        db.square_comments.add(uid, book_title, content, rating=rating)
        return make_result()

    @args_required_method(args_get)
    def get(self):
        data = db.square_comments.find(self.args_get.parse_args().get('book_title'))
        return make_result(data={'comments': data})


class SquareBookListAPI(Resource):
    args_post = reqparse.RequestParser() \
        .add_argument("book_title", help="书名", type=str, required=True, location=["json", ]) \
        .add_argument("list_name", help="书单名称", type=str, required=True, location=["json", ])
    args_get = reqparse.RequestParser() \
        .add_argument("list_name", help="书单名称", type=str, required=False, location=["args", ])

    @args_required_method(args_post)
    @auth_required_method
    def post(self, uid: int):
        args = self.args_post.parse_args()
        db.square_book_list.add(uid, args.get('book_title'), args.get('list_name'))
        return make_result()

    @args_required_method(args_get)
    @auth_required_method
    def get(self, uid: int):
        list_name = self.args_get.parse_args().get('list_name')
        if list_name is None:
            return make_result(data={'book_lists': db.square_book_list.find_lists(uid)})
        return make_result(data={'book_list': db.square_book_list.find(uid, list_name)})


class SquareMessagesAPI(Resource):
    args_post = reqparse.RequestParser() \
        .add_argument("to_uid", help="目标用户", type=str, required=True, location=["json", ]) \
        .add_argument("content", help="私信内容", type=str, required=True, location=["json", ])

    @args_required_method(args_post)
    @auth_required_method
    def post(self, uid: int):
        args = self.args_post.parse_args()
        db.square_messages.add(uid, args.get('to_uid'), args.get('content'))
        return make_result()

    @auth_required_method
    def get(self, uid: int):
        data = db.square_messages.find(uid)
        return make_result(data={'messages': data})


class SquareRelationsAPI(Resource):
    args_post = reqparse.RequestParser() \
        .add_argument("to_uid", help="目标用户", type=int, required=True, location=["json", ]) \
        .add_argument("is_friends", help="是否关注", type=bool, required=False, location=["json", ])
    args_get = reqparse.RequestParser() \
        .add_argument("to_uid", help="目标用户", type=int, required=False, location=["args", ])

    @args_required_method(args_post)
    @auth_required_method
    def post(self, uid: int):
        args = self.args_post.parse_args()
        db.square_relations.add(uid, args.get('to_uid'), args.get('is_friends', True))
        return make_result()

    @args_required_method(args_get)
    @auth_required_method
    def get(self, uid: int):
        to_uid = self.args_get.parse_args().get('to_uid')
        if to_uid is not None:
            return make_result(data={'relations': {'is_friends': db.square_relations.find_one(uid, to_uid)}})
        return make_result(data={'relations': {'friends': db.square_relations.find(uid)}})


class SquareDynamicAPI(Resource):
    args_post = reqparse.RequestParser() \
        .add_argument("dynamic", help="动态内容", type=str, required=True, location=["json", ])
    args_get = reqparse.RequestParser() \
        .add_argument("to_uid", help="目标用户", type=int, required=False, location=["args", ])

    @args_required_method(args_post)
    @auth_required_method
    def post(self, uid: int):
        args = self.args_post.parse_args()
        db.square_dynamic.add(uid, dynamic=args.get('dynamic'))
        return make_result()

    @args_required_method(args_get)
    @auth_required_method
    def get(self, uid: int):
        return make_result(data={'dynamic': db.square_dynamic.find(uid)})


class SquareAllAPI(Resource):
    def get(self):
        return make_result(data={'all': db.square_all.find()})
