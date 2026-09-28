MAROOF KHAN — HERO LAYER KIT

Recommended z-index / order:
01 background_crowd — z-index 1, low opacity + blur, slowest parallax
02 particle_dust — z-index 2, subtle opacity, very slow drift
03 circle_ring — z-index 3, rotate slowly
04 main_person_cutout — z-index 5, centered, largest depth movement
05 foreground_people — z-index 7, blurred/dark, faster parallax
06 corner_brackets — z-index 8
07 light_flare — z-index 9, animated horizontal sweep
08 scroll_indicator — z-index 10

For the closest recreation, keep the actual text/navigation/buttons as HTML/CSS rather than raster images.
The main-person cutout should be positioned with absolute/fixed layering so scroll-driven scaling and 3D parallax can be applied independently.
