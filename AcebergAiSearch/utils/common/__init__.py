from flask import Flask, jsonify, request
from flask_jwt_extended import JWTManager, get_jwt_identity, verify_jwt_in_request
from flask_jwt_extended.exceptions import NoAuthorizationError, InvalidHeaderError, RevokedTokenError
from utils.sql import SQLiteClass
from functools import wraps

# 自定义装饰器来验证 token
def validate_token(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        try:
            # 验证 token 的有效性
            verify_jwt_in_request()
            # 获取当前用户的 ID
            current_user = get_jwt_identity()
            with SQLiteClass("acebergaisearch.db") as cursor:
                user = cursor.select_data("users", condition="account='{}'".format(current_user))
            if not user:
                return jsonify({'msg': 'Data no exists!'}), 401
    
        except NoAuthorizationError:
            # 如果没有提供 token
            return jsonify({"msg": "Missing token"}), 401
        except InvalidHeaderError:
            # 如果 token 的头部无效
            return jsonify({"msg": "Invalid JWT header"}), 401
        # except ExpiredSignatureError:
        #     # 如果 token 已经过期
        #     return jsonify({"msg": "Token has expired"}), 401
        except RevokedTokenError:
            # 如果 token 已经被撤销
            return jsonify({"msg": "Token has been revoked"}), 401
        except Exception as e:
            # 其他类型的错误
            return jsonify({"msg": str(e)}), 401

        return func(*args, **kwargs)
    return wrapper