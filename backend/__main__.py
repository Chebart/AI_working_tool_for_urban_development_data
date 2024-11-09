import asyncio
import logging
import os
import stat

import uvicorn
from fastapi import FastAPI

from backend.routers import base_router


fastapi_app = FastAPI(
    title="YAT API",
    summary="Transport AI",
)
fastapi_app.include_router(base_router)
# fastapi_app.include_router(test_router)


async def run_web(port=9000, host='localhost'):
    """ Function to run a web server """
    uid = os.getuid()
    gid = os.getgid()
    config = uvicorn.Config(f"{__name__}:fastapi_app", host=host, port=port, log_level="info")
    server = uvicorn.Server(config)
    await server.serve()


if __name__ == "__main__":
    asyncio.run(run_web(
        port=os.environ.get("PORT", 9000),
        host=os.environ.get("HOST", "localhost"),
    ))
