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
| **height_translate_factor** | `int` | Waveform Y translation |
| **consecutive_thresholds** | `int` |  Number of consecutive above/below amp threshold to speed up particles or not |
| **error** | `int` |  Error for threshold |
| **amp_condition_val** | `int` |  Base amp threshold value to compare |

# Credits
- Kygo & Selena Gomez - It Ain't Me (Codeko Remix)
- Inspired by Colorful Coding
