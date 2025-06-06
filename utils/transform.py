import numpy as np
from svgpathtools import parse_path

# Utility functions
def sort_points(points, clockwise=True):
    """Sort points in a numpy array clockwise or counterclockwise."""
    if points.size == 0:
        return points

    centroid = np.mean(points, axis=0)
    angles = np.arctan2(points[:, 1] - centroid[1], points[:, 0] - centroid[0])
    sorted_indices = np.argsort(-angles if clockwise else angles)
    
    return points[sorted_indices]

def calculate_centroid(points):
    """Calculate the centroid of a set of points, removing duplicates."""
    points_array = np.array(points)
    unique_points = np.unique(points_array, axis=0)
    centroid = np.mean(unique_points, axis=0, dtype=np.float64)
    return centroid

def format_float(value):
    """Format float to remove unnecessary decimal points."""
    if value.is_integer():
        return str(int(value))
    return f"{value:.6f}".rstrip('0').rstrip('.')

def transform_svg_element(elem, polygon, dx=0, dy=0, angle=0):
    """Apply transformation to an SVG element based on polygon and translation."""
    translated_polygon = polygon + np.array([dx, dy])
    polygon_centroid = calculate_centroid(translated_polygon)

    tag = elem.tag.split('}')[-1]
    
    transform_functions = {
        'rect': apply_transform_to_rect,
        'circle': apply_transform_to_circle_or_ellipse,
        'ellipse': apply_transform_to_circle_or_ellipse,
        'line': apply_transform_to_line,
        'polyline': apply_transform_to_polyline_or_polygon,
        'polygon': apply_transform_to_polyline_or_polygon,
        'path': apply_transform_to_path,
        'g': apply_transform_to_group,
        'image': apply_transform_to_image
    }

    if tag in transform_functions:
        transform_functions[tag](elem, polygon_centroid, angle)

    return elem

def apply_transform_to_rect(elem, centroid, angle):
    """Apply transformation to a rectangle element."""
    width, height = float(elem.get('width', 0)), float(elem.get('height', 0))
    
    x, y = centroid[0] - (width / 2), centroid[1] - (height / 2)

    # Cập nhật vị trí của rect mà không dùng translate
    elem.set('x', format_float(x))
    elem.set('y', format_float(y))
    elem.set('width', format_float(width))
    elem.set('height', format_float(height))

    # Áp dụng phép xoay thông qua transform
    transform_str = f"rotate({np.degrees(angle)} {format_float(centroid[0])} {format_float(centroid[1])})"
    elem.set('transform', transform_str)

def apply_transform_to_circle_or_ellipse(elem, centroid, angle):
    """Apply transformation to a circle or ellipse element."""
    cx, cy = centroid

    # Cập nhật vị trí của circle/ellipse mà không dùng translate
    elem.set('cx', format_float(cx))
    elem.set('cy', format_float(cy))

    # Áp dụng phép xoay thông qua transform
    transform_str = f"rotate({np.degrees(angle)} {format_float(cx)} {format_float(cy)})"
    elem.set('transform', transform_str)

def apply_transform_to_line(elem, centroid, angle):
    """Apply transformation to a line element."""
    x1, y1 = float(elem.get('x1', 0)), float(elem.get('y1', 0))
    x2, y2 = float(elem.get('x2', 0)), float(elem.get('y2', 0))

    midpoint = np.array([(x1 + x2) / 2, (y1 + y2) / 2])
    delta = centroid - midpoint

    x1 += delta[0]
    y1 += delta[1]
    x2 += delta[0]
    y2 += delta[1]

    elem.set('x1', format_float(x1))
    elem.set('y1', format_float(y1))
    elem.set('x2', format_float(x2))
    elem.set('y2', format_float(y2))
    
    transform_str = f"rotate({np.degrees(angle)} {format_float(centroid[0])} {format_float(centroid[1])})"
    elem.set('transform', transform_str)

def apply_transform_to_polyline_or_polygon(elem, centroid, angle):
    """Apply transformation to a polyline or polygon element."""
    points = np.array([[float(coord) for coord in point.split(',')] for point in elem.get('points', '').strip().split()])
    current_centroid = calculate_centroid(points)
    delta = centroid - current_centroid
    moved_points = points + delta

    points_str = ' '.join([f"{format_float(x)},{format_float(y)}" for x, y in moved_points])
    elem.set('points', points_str)

    transform_str = f"rotate({np.degrees(angle)} {format_float(centroid[0])} {format_float(centroid[1])})"
    elem.set('transform', transform_str)

def apply_transform_to_path(elem, centroid, angle):
    """Apply transformation to a path element."""
    path = parse_path(elem.get('d', ''))
    points = np.array([[seg.start.real, seg.start.imag] for seg in path] +
                      [[seg.end.real, seg.end.imag] for seg in path])
    current_centroid = calculate_centroid(points)
    delta = centroid - current_centroid

    path_d = ""
    for seg in path:
        start = np.array([seg.start.real, seg.start.imag]) + delta
        end = np.array([seg.end.real, seg.end.imag]) + delta
        cmd = f"M{format_float(start[0])},{format_float(start[1])} L{format_float(end[0])},{format_float(end[1])} "
        path_d += cmd
    elem.set('d', path_d.strip())

    transform_str = f"rotate({np.degrees(angle)} {format_float(centroid[0])} {format_float(centroid[1])})"
    elem.set('transform', transform_str)

def apply_transform_to_group(elem, centroid, angle):
    """Apply transformation to a group element."""
    for child in elem:
        transform_svg_element(child, [centroid], angle=angle)

    transform_str = f"rotate({np.degrees(angle)} {format_float(centroid[0])} {format_float(centroid[1])})"
    elem.set('transform', transform_str)

def apply_transform_to_image(elem, centroid, angle):
    """Apply transformation to an image element."""
    width, height = float(elem.get('width', 0)), float(elem.get('height', 0))
    x, y = centroid[0] - width / 2, centroid[1] - height / 2
    elem.set('x', format_float(x))
    elem.set('y', format_float(y))
    elem.set('width', format_float(width))
    elem.set('height', format_float(height))
    transform_str = f"rotate({np.degrees(angle)} {format_float(centroid[0])} {format_float(centroid[1])})"
    elem.set('transform', transform_str)