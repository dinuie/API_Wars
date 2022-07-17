from typing import List, Dict
from psycopg2 import sql
from psycopg2.extras import RealDictCursor
import database_connection


@database_connection.connection_handler
def save_registered_user(cursor: RealDictCursor, username, password):
    dict1 = {
        'username': username,
        'password': password
    }
    query = """
        INSERT INTO accounts
        VALUES (%(username)s, %(password)s)"""
    cursor.execute(query, dict1)


@database_connection.connection_handler
def get_hashed_password(cursor: RealDictCursor, username):
    basedict = {
        'username': username
    }
    query = """
        SELECT accounts.password
        FROM accounts
        WHERE accounts.username = %(username)s
        """
    cursor.execute(query, basedict)
    return cursor.fetchone()


@database_connection.connection_handler
def check_if_taken(cursor: RealDictCursor, username):
    basedict = {
        'username': username
    }
    query = """
        SELECT COUNT(accounts.username) as "usernames"
        FROM accounts
        WHERE accounts.username = %(username)s
        GROUP BY accounts.username
        """
    cursor.execute(query, basedict)
    return cursor.fetchone()