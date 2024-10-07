from fastapi import FastAPI
from .routers import recommend
import ray

app = FastAPI()

app.include_router(recommend.router)

ray.init(num_cpus=16, num_gpus=1, ignore_reinit_error=True)

if __name__ == "__main__":
    if not ray.is_initialized():
        ray.init(num_cpus=16, num_gpus=1, ignore_reinit_error=True)