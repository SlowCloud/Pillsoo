import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch
from app.main import app

client = TestClient(app)

# Mock 데이터베이스 데이터
MOCK_DB_ITEMS = [
    (1, "Supplement A", "This supplement is good for..."),
    (2, "Supplement B", "This supplement helps with..."),
    (3, "Supplement C", "Recommended for..."),
    (4, "Supplement D", "Known for..."),
]

# API 테스트
def test_recommend_supplements():
    # 'app.routers.recommend.get_functionality_items' 경로를 실제 패치할 경로로 수정하세요.
    with patch('app.routers.recommend.get_functionality_items', return_value=MOCK_DB_ITEMS):
        response = client.get("/api/v1/recommend/survey?client_text=Boosts immunity")
        assert response.status_code == 200

        result = response.json()
        assert len(result) == 3

        assert result[0] == {
            "supplementSeq": 1,
            "pill_name": "Supplement A",
            "functionality": "This supplement is good for..."
        }
        assert result[1] == {
            "supplementSeq": 2,
            "pill_name": "Supplement B",
            "functionality": "This supplement helps with..."
        }
        assert result[2] == {
            "supplementSeq": 3,
            "pill_name": "Supplement C",
            "functionality": "Recommended for..."
        }
