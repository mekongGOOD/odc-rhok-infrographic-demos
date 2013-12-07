# Compass config file

# Require any additional compass plugins here.
# require 'zurb-foundation'
require 'sass-globbing'

# Set this to the root of your project when deployed:
#http_path = "/"
css_dir = "src/client/css"
sass_dir = "src/client/sass"
images_dir = "src/client/img"
javascripts_dir = "src/client/js" + ((environment == :production) ? "_min" : "")

# You can select your preferred output style here (can be overridden via the command line):
# output_style = :expanded or :nested or :compact or :compressed
output_style = (environment == :production) ? :compressed : :expanded

# To enable relative paths to assets via compass helper functions. Uncomment:
relative_assets = true

# To disable debugging comments that display the original location of your selectors. Uncomment:
# line_comments = false
line_comments = (environment == :development)

# If you prefer the indented syntax, you might want to regenerate this
# project again passing --syntax sass, or you can uncomment this:
# preferred_syntax = :sass
# and then run:
# sass-convert -R --from scss --to sass sass scss && rm -rf sass && mv scss sass
