import os
import shutil
from typing import List, Union
from uuid import uuid4


def delete_archive_after_downloading(archive_path: str,
                                     logger):
    """
    Функция удаления архива с результатами после того, как его скачали
    """
    try:
        os.remove(archive_path)
    except Exception as e:
        logger.error("Не удалось удалить файл %s. Traceback: %s", archive_path, e)

def set_tasks_name(custom_name: Union[str, None] = None):
    """
    Функция, с помощью которой задаются имена задач
    """
    if custom_name:
        return f"{custom_name}_data_preparation_task", f"{custom_name}_train_yolo_task"
    else:
        return str(uuid4()), str(uuid4())


def delete_all_data_related_to_task(tasks_to_delete: List[str],
                                    runs_dir = "/app/data/runs",
                                    dataset_dir = "/app/data/datasets",
                                    weights_dir = "/app/data/weights",
                                    test_video_dir = "/app/data/test_videos"):
    """
    Функция удаления всех данных, связанных с задачами
    """
    for task_id in tasks_to_delete:
        task_id = task_id.strip()
        # Результаты обучения, валидации, предсказаний
        for model_stage in ["train", "val", "predict"]:
            if os.path.exists(f"{runs_dir}/{model_stage}/{task_id}"):
                shutil.rmtree(f"{runs_dir}/{model_stage}/{task_id}")
        # Данные обучения
        if os.path.exists(f"{dataset_dir}/{task_id}"):
            shutil.rmtree(f"{dataset_dir}/{task_id}")
        # Веса модели
        if os.path.exists(f"{weights_dir}/{task_id}"):
            os.remove(f"{weights_dir}/{task_id}")
        # Тестовое видео
        if os.path.exists(f"{test_video_dir}/{task_id}"):
            os.remove(f"{test_video_dir}/{task_id}")