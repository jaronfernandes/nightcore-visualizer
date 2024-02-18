# nightcore-visualizer

# Setup
Add your song and image to the `assets` folder. Then in `sketch.js` modify the constants `song_text`, `artists`, `song_file_name`, and `img_file_name` to match the names of the files you added.

# Parameters

| Parameter (`const`) | Type | Description |
| ------------- |:-------------:| -----:|
| **blur_image** | `boolean` | Blurs background image |
| **song_text** | `string` | Song name to display |
| **artists** | `string` | Artists to display |
| **song_file_name** | `string` | Song file name in the assets folder |
| **img_file_name** | `string` | Background pic in the assets folder |
| **font** | `string`, `p5.Font` | Font for text (may have to use loadFont for non p5.js fonts) |
| **stretch_factor** | `int` | Waveform X-stretch |
| **ellipseScaleY** | `int` | Frequency Y-stretch |
| **height_translate_factor** | `int` | Waveform Y translation |
| **amp_condition_val** | `int` |  Base amp threshold value to compare |
| **consecutive_thresholds** | `int` |  Number of consecutive above/below amp threshold to speed up particles or not |
| **error** | `int` |  Error for amplitude threshold |
| **disable_particles** | `boolean` | Disables background particles |
| **visualizer_setting** | `int` |  0 - Waveform, 1 - Waveform bars, 2 - Frequency bars |
| **rectangular_colour** | `int[4]` |  Bar colour |
| **song_text_colour** | `int[4]` |  Song text colour |
| **artists_text_colour** | `int[4]` |  Artists text colour |

# Demo
![Screenshot](demo_images/it_aint_me_demo.png)

# Credits
- Kygo & Selena Gomez - It Ain't Me (Codeko Remix)
- Inspired by Colorful Coding
