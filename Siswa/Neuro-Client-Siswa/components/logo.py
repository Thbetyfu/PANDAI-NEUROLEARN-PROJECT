import customtkinter as ctk
from PIL import Image
import os
import io
from resvg_python import svg_to_png

def load_svg_as_pil(file_path, width=None, height=None, svg_data=None):
    """Utility to load SVG file or data and return it as a high-quality PIL Image using resvg.
    Optimized: Renders at 3x resolution for sharpness on High-DPI displays.
    """
    try:
        if not svg_data:
            with open(file_path, "r", encoding='utf-8') as f:
                svg_data = f.read()
        
        # Ensure it's a string
        if not isinstance(svg_data, str):
            svg_data = svg_data.decode('utf-8')

        # Default sizes if none provided
        target_w = int(width) if width else 64
        target_h = int(height) if height else 64
        
        # Boost resolution for high-quality rendering (3x)
        render_w = target_w * 3
        render_h = target_h * 3

        # Robust SVG tag modification
        if '<svg' in svg_data:
            import re
            # Extract the opening <svg ... > tag
            match = re.search(r'<svg[^>]*>', svg_data)
            if match:
                tag = match.group(0)
                # Remove any existing width/height within the tag
                new_tag = re.sub(r'\s(width|height)="[^"]*"', '', tag)
                # Inject high-res dimensions
                new_tag = new_tag.replace('<svg', f'<svg width="{render_w}" height="{render_h}"', 1)
                # Replace back in the main data
                svg_data = svg_data.replace(tag, new_tag, 1)

        png_list = svg_to_png(svg_data)
        img = Image.open(io.BytesIO(bytes(png_list)))
        return img
    except Exception as e:
        print(f"Error loading SVG: {e}")
        # Return a transparent fallback
        return Image.new("RGBA", (int(width) if width else 64, int(height) if height else 64), (0, 0, 0, 0))

class PandaiFullLogo(ctk.CTkFrame):
    """Logo from assets/logo_full.svg"""
    def __init__(self, master, height=32, **kwargs):
        super().__init__(master, fg_color="transparent", **kwargs)
        assets_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), "assets")
        svg_path = os.path.join(assets_dir, "logo_full.svg")
        
        # Original is 97x26.
        scale = height / 26
        width = int(97 * scale)
        
        pil_img = load_svg_as_pil(svg_path, width=width, height=height)
        self.ctk_img = ctk.CTkImage(light_image=pil_img, dark_image=pil_img, size=(width, height))
        
        self.label = ctk.CTkLabel(self, image=self.ctk_img, text="")
        self.label.pack()

class PandaiEmotLogo(ctk.CTkFrame):
    """Greeting icon from assets/Logo PANDAI Emot.svg"""
    def __init__(self, master, size=65, **kwargs):
        super().__init__(master, fg_color="transparent", **kwargs)
        assets_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), "assets")
        svg_path = os.path.join(assets_dir, "Logo PANDAI Emot.svg")
        
        # 80x65 original
        scale = size / 65
        width = int(80 * scale)
        
        pil_img = load_svg_as_pil(svg_path, width=width, height=size)
        self.ctk_img = ctk.CTkImage(light_image=pil_img, dark_image=pil_img, size=(width, size))
        
        self.label = ctk.CTkLabel(self, image=self.ctk_img, text="")
        self.label.pack()
