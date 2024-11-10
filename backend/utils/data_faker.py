import os
import random
from pathlib import Path

import cv2
import numpy as np


def create_synthetic_dataset(num_images=10, img_size=(640, 640), output_dir="synthetic_dataset"):

    Path(output_dir).mkdir(parents=True, exist_ok=True)
    Path(output_dir + '/images').mkdir(parents=True, exist_ok=True)
    Path(output_dir + '/labels').mkdir(parents=True, exist_ok=True)
    coordinate_bias = img_size[0] // 5
    for i in range(num_images):
        img = np.ones((img_size[0], img_size[1], 3), dtype=np.uint8) * 255
        img = cv2.cvtColor(np.array(img), cv2.COLOR_BGR2RGB)
        num_shapes = random.randint(1, 5)

        label_data = []

        for _ in range(num_shapes):
            img = np.array(img)
            shape_type = random.choice(['rectangle', 'circle'])
            color = (random.randint(0, 255), random.randint(0, 255), random.randint(0, 255))

            if shape_type == 'rectangle':
                x1, y1 = random.randint(0, img_size[0]//2), random.randint(0, img_size[1]//2)
                x2, y2 = random.randint(x1 + 20, img_size[0]), random.randint(y1 + 20, img_size[1])
                cv2.rectangle(img, (x1, y1), (x2, y2), color, -1)
                label = [0, (x1 + x2) / 2 / img_size[0], (y1 + y2) / 2 / img_size[1],
                         (x2 - x1) / img_size[0], (y2 - y1) / img_size[1]]

            else:
                x, y = (
                    random.randint(coordinate_bias, img_size[0] - coordinate_bias),
                    random.randint(coordinate_bias, img_size[0] - coordinate_bias)
                )
                radius = random.randint(20, 100)
                cv2.circle(img, (x, y), radius, color, -1)
                label = [1, x / img_size[0], y / img_size[1], radius*2 / img_size[0], radius*2 / img_size[1]]

            label_data.append(label)

        # Save the image
        image_filename = f'{output_dir}/images/{i}.jpg'
        cv2.imwrite(image_filename, img)

        # Save the corresponding YOLO annotation
        label_filename = f'{output_dir}/labels/{i}.txt'
        with open(label_filename, 'w') as f:
            for lbl in label_data:
                f.write(" ".join(map(str, lbl)) + "\n")

    print(f"Created {num_images} synthetic images and annotations in {output_dir}/.")


if __name__ == "__main__":
    create_synthetic_dataset(
        num_images=20, output_dir='../../data/datasets/synthetic_dataset/train', img_size=(640, 640)
    )
