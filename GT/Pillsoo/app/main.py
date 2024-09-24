from fastapi import FastAPI
from .routers import recommend

app = FastAPI()

app.include_router(recommend.router)
