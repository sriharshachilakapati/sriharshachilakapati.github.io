# frozen_string_literal: true

# Monkey-patch jekyll-tabler to cache YAML icon data.
# The original `tabler_icons` method calls YAML.load_file on every render,
# re-reading and re-parsing a 956KB file each time. This caches the result
# so each file is loaded exactly once per build.

module Jekyll
  module Tabler
    @tabler_icon_data = {}

    def self.tabler_icons(type)
      @tabler_icon_data[type] ||= begin
        data_path = File.join(
          Gem.loaded_specs["jekyll-tabler"].full_gem_path,
          "assets",
          "#{type}.yml"
        )
        YAML.load_file(data_path)
      end
    end
  end
end
