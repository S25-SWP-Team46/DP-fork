from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.parsers import BaseParser

from engines import postgres_engine
from engines.exceptions import QueryError
from engines.shortcuts import db_exists

from chroma.ChromaClient import ChromaClient
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
import time

import json

from .docs import (
    get_db_schema_doc, post_db_query_doc,
    put_db_schema_doc
)

@method_decorator(csrf_exempt, name='dispatch')
class ChromaQueryParser(APIView):
    
    def post(self, request):
        data = json.loads(request.body)
        action = data.get('action')
        
        if action == 'state':
            return self.chroma_state(request)
        else:
            return self.chroma_query(request)
    
    def chroma_query(self, request):
        try:
            data = json.loads(request.body)
            query_text = data.get("code")
            user_id = data.get("user_id")
        except Exception:
            query_text = None

        if not query_text:
            return Response({"error": "Missing query"}, status=400)
        
        print(f"Received query: {query_text}")
        
        try:
            start_time = time.time()
            
            chroma_client = ChromaClient()
            result = chroma_client.query_parser(user_id, query_text)
            
            db_state_response = chroma_client.get_db_state(user_id)
            db_state = db_state_response.get("state", [])
            
            execution_time = time.time() - start_time
            
            return Response({
                "command": result.get("command", "UNKNOWN"),
                "result": result,
                "db_state": db_state,
                "execution_time": f"{execution_time:.4f} seconds",
                "documents_count": len(db_state)
            })
        
        except Exception as e:
            return Response({"error": str(e)}, status=400)

    def chroma_state(self, request):
        try:
            data = json.loads(request.body)
            user_id = data.get("user_id")
        except Exception:
            user_id = None
        if not user_id:
            return Response({"error": "Missing user_id"}, status=400)
        
        try:
            chroma_client = ChromaClient()
            state_response = chroma_client.get_db_state(user_id)
            state = state_response.get("state", [])
            return Response({"state": state})
        except Exception as e:
            return Response({"error": "User not found"})
        


class PlainTextParser(BaseParser):
    media_type = 'text/plain'
    def parse(self, stream, media_type=None, parser_context=None):
        return stream.read().decode('utf-8')


class PutView(APIView):
    @put_db_schema_doc
    def put(self, request: Request):
        data = json.loads(request.body)
        db_name = data.get("user_id")

        if db_exists(postgres_engine, db_name):
            postgres_engine.drop_db(db_name)

        dump = """
        CREATE TABLE users (
            id SERIAL PRIMARY KEY,
            username VARCHAR(50),
            email VARCHAR(100)
        );
"""
        postgres_engine.create_db(db_name, dump)

        return Response({"detail": "Database was set up"}, status=214)


class SchemaView(APIView):
    @get_db_schema_doc
    def get(self, request: Request):
        data = json.loads(request.body)
        db_name = data.get("user_id")
        schema = postgres_engine.get_db(db_name)

        return Response(schema.to_json())


class QueryView(APIView):

    parser_classes = [PlainTextParser]

    @post_db_query_doc
    def post(self, request: Request):
        data = json.loads(request.body)
        db_name = data.get("user_id")

        query = request.data
        query = query.strip()
        query = query.replace('\\n', '')
        print("\n\nDATA:", query, "\n\n")
        if not isinstance(query, str):
            return Response({"detail": "Not a plain string query"}, status=400)
        
        try:
            results = postgres_engine.send_query(db_name, query)
        except QueryError as e:
            return Response({"detail": "QueryError: "+str(e)}, status=400)

        schema = postgres_engine.get_db(db_name)

        json_results = [r.to_json() for r in results]
        json_schema = schema.to_json()

        return Response({
            "results": json_results,
            "schema": json_schema
        })
        