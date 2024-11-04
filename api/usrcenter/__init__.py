from flask import Blueprint, request, jsonify
# from utils.ai import _
from utils.sql import SQLiteClass
from utils.common import validate_token


usrcenter_blueprint = Blueprint("usrcenter_module", __name__)

        
@usrcenter_blueprint.route("/usrcenter_update", methods=["POST"])
@validate_token
def usrcenter_update():
    account = request.json.get('account', None)
    path = request.json.get('path', None)
    key = request.json.get('key', None)

    print(account, path, key)
    with SQLiteClass("acebergaisearch.db") as cursor:
        user = cursor.select_data("users", condition="account='{}'".format(account))

    if not user:
        return jsonify({'msg': 'Account no exists!'}), 401

    # 更新字段的逻辑
    with SQLiteClass("acebergaisearch.db") as cursor:
        result = cursor.update_data("users", {"path": path, "key": key}, condition="account='{}'".format(account))
    if result:
        return jsonify({'msg': 'Save success!','status':'success'}), 200
    else:
        return jsonify({'msg': 'Save failed!','status':'error'}), 200


@usrcenter_blueprint.route("/usrcenter_show", methods=["POST"])
@validate_token
def usrcenter_show():
    account = request.json.get('account', None)

    with SQLiteClass("acebergaisearch.db") as cursor:
        user = cursor.select_data("users", condition="account='{}'".format(account))

    if not user:
        return jsonify({'msg': 'Account no exists!'}), 401
    
    # 更新字段的逻辑
    with SQLiteClass("acebergaisearch.db") as cursor:
        result = cursor.select_data("users", condition="account='{}'".format(account))

    data = {
        "account": user[0][1],
        "password": user[0][2],
        "role": user[0][6],
    }
    if result:
        return jsonify({'msg': 'Query success!','status':'success', 'data':data}), 200
    else:
        return jsonify({'msg': 'Query failed!','status':'error'}), 200


