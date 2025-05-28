import arcade
import math
from typing import List, Tuple

SCREEN_WIDTH = 800
SCREEN_HEIGHT = 600
POINT_RADIUS = 5
PIXELS_PER_METER = 100

Point = Tuple[float, float]


def catmull_rom(p0, p1, p2, p3, t):
    """Interpolates a point on a Catmull-Rom spline"""
    t2 = t * t
    t3 = t2 * t
    return (
        0.5 * (
            (2 * p1[0]) +
            (-p0[0] + p2[0]) * t +
            (2 * p0[0] - 5 * p1[0] + 4 * p2[0] - p3[0]) * t2 +
            (-p0[0] + 3 * p1[0] - 3 * p2[0] + p3[0]) * t3
        ),
        0.5 * (
            (2 * p1[1]) +
            (-p0[1] + p2[1]) * t +
            (2 * p0[1] - 5 * p1[1] + 4 * p2[1] - p3[1]) * t2 +
            (-p0[1] + 3 * p1[1] - 3 * p2[1] + p3[1]) * t3
        )
    )


def bezier(p0, p1, p2, p3, t):
    """Cubic Bezier interpolation"""
    u = 1 - t
    tt = t * t
    uu = u * u
    uuu = uu * u
    ttt = tt * t

    x = uuu * p0[0] + 3 * uu * t * p1[0] + 3 * u * tt * p2[0] + ttt * p3[0]
    y = uuu * p0[1] + 3 * uu * t * p1[1] + 3 * u * tt * p2[1] + ttt * p3[1]
    return x, y


class CurveEditor(arcade.Window):
    def __init__(self):
        super().__init__(SCREEN_WIDTH, SCREEN_HEIGHT, "Curve Editor")
        self.points: List[Point] = []
        self.show_catmull = True
        self.show_bezier = True

    def on_draw(self):
        self.clear()

        # Draw control points
        for x, y in self.points:
            arcade.draw_circle_filled(x, y, POINT_RADIUS, arcade.color.RED)

        if self.show_catmull and len(self.points) >= 2:
            extended_points = self.points.copy()

            # Extrapolate start point
            first = self.points[0]
            second = self.points[1]
            extrapolated_start = (2 * first[0] - second[0], 2 * first[1] - second[1])
            extended_points.insert(0, extrapolated_start)

            # Extrapolate end point
            last = self.points[-1]
            penultimate = self.points[-2]
            extrapolated_end = (2 * last[0] - penultimate[0], 2 * last[1] - penultimate[1])
            extended_points.append(extrapolated_end)

            for i in range(1, len(extended_points) - 2):
                for t in range(100):
                    p1 = catmull_rom(extended_points[i - 1], extended_points[i],
                                     extended_points[i + 1], extended_points[i + 2], t / 100)
                    p2 = catmull_rom(extended_points[i - 1], extended_points[i],
                                     extended_points[i + 1], extended_points[i + 2], (t + 1) / 100)
                    arcade.draw_line(p1[0], p1[1], p2[0], p2[1], arcade.color.BLUE, 2)

        if self.show_bezier and len(self.points) >= 4:
            for i in range(0, len(self.points) - 3, 3):
                for t in range(100):
                    p1 = bezier(self.points[i], self.points[i + 1],
                                self.points[i + 2], self.points[i + 3], t / 100)
                    p2 = bezier(self.points[i], self.points[i + 1],
                                self.points[i + 2], self.points[i + 3], (t + 1) / 100)
                    arcade.draw_line(p1[0], p1[1], p2[0], p2[1], arcade.color.GREEN, 2)

        # Instructions
        arcade.draw_text("Click: Add Point | B: Toggle Bezier | C: Toggle Catmull-Rom | R: Reset Canvas | E: Export Points",
                         10, 10, arcade.color.BLACK, 14)

    def on_mouse_press(self, x, y, button, modifiers):
        if button == arcade.MOUSE_BUTTON_LEFT:
            self.points.append((x, y))

    def on_key_press(self, symbol, modifiers):
        if symbol == arcade.key.E:
            print("Exported Points (in meters):")
            for p in self.points:
                meters = (p[0] / PIXELS_PER_METER, p[1] / PIXELS_PER_METER)
                print(f"({meters[0]:.2f} m, {meters[1]:.2f} m)")

        elif symbol == arcade.key.B:
            self.show_bezier = not self.show_bezier

        elif symbol == arcade.key.C:
            self.show_catmull = not self.show_catmull

        elif symbol == arcade.key.R:
            self.points.clear()


if __name__ == "__main__":
    CurveEditor()
    arcade.run()
