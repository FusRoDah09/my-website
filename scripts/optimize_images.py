import shutil
import tempfile
from pathlib import Path
from PIL import Image, ImageSequence


ROOT = Path(__file__).resolve().parents[1]
IMAGES_DIR = ROOT / "src" / "images"

ANIMATED_GIFS = [
    "best-banana-cat.gif",
    "black-cat-walking.gif",
    "brick-throwing-a-brick.gif",
    "cat-funny-cat.gif",
    "cat-goofy-goober.gif",
    "cat-hb.gif",
    "concac.gif",
    "devilcat-cat-devil.gif",
    "dibble-dibbles.gif",
    "happy-catto.gif",
    "he-died-cat-falling-over.gif",
    "helicopter-cat-wunkus.gif",
    "reaction-meme-stan-twt.gif",
    "silly-cat-silly-car.gif",
    "stare-cat.gif",
    "verycat-cat-eating-chips.gif",
    "what-excuse-me.gif",
]

STATIC_IMAGES = {
    "0iqcat.png": {"quality": 82},
    "cap-wojak.png": {"quality": 82},
    "image.png": {"quality": 82},
    "palantir.png": {"quality": 82},
    "profile-shrug.png": {"quality": 82},
}


def convert_animated_gif(src: Path, dest: Path) -> None:
    image = Image.open(src)
    frames = [frame.convert("RGBA") for frame in ImageSequence.Iterator(image)]
    durations = [
        frame.info.get("duration", image.info.get("duration", 100))
        for frame in ImageSequence.Iterator(image)
    ]
    original_size = src.stat().st_size
    best_path = None
    best_size = None

    for quality in (68, 60, 50, 40):
        candidate = Path(tempfile.gettempdir()) / f"{src.stem}-{quality}.webp"
        frames[0].save(
            candidate,
            format="WEBP",
            save_all=True,
            append_images=frames[1:],
            duration=durations,
            loop=image.info.get("loop", 0),
            quality=quality,
            method=6,
        )
        candidate_size = candidate.stat().st_size

        if candidate_size < original_size and (best_size is None or candidate_size < best_size):
            best_path = candidate
            best_size = candidate_size

    if best_path is None:
        if dest.exists():
            dest.unlink()
        print(f"skip {src.name} (original is smaller)")
        return

    shutil.copyfile(best_path, dest)
    print(f"animated {src.name} -> {dest.name}")


def convert_static_image(src: Path, dest: Path, quality: int) -> None:
    image = Image.open(src).convert("RGBA")
    image.save(dest, format="WEBP", quality=quality, method=6)


def main() -> None:
    for filename in ANIMATED_GIFS:
        src = IMAGES_DIR / filename
        dest = src.with_suffix(".webp")
        convert_animated_gif(src, dest)

    for filename, options in STATIC_IMAGES.items():
        src = IMAGES_DIR / filename
        dest = src.with_suffix(".webp")
        convert_static_image(src, dest, options["quality"])
        print(f"static {filename} -> {dest.name}")


if __name__ == "__main__":
    main()
