file = "circle.svg";

is_rounded = false;

module offsetFilled(off) {
    offset(off)
    import(file, center = true);
}

module offsetThin(off, thickness) {
    difference() {
       offsetFilled(off + thickness);
       offsetFilled(off);
    }
}

/*********/
/* Outer */
/*********/
gap = 1;
handle_height = 8;

union() {
    // cutter
    linear_extrude(handle_height * 1.8)
        offsetThin(gap, .5);

    // handle
    linear_extrude(handle_height / 2)
        offsetThin(gap, 3);

    // rounded handle
    if (is_rounded) {
        for (i = [0:0.1:1.4]) {
            translate([0, 0, handle_height / 2 + i])
                linear_extrude(.5)
                offsetThin(gap, 3 - i*i);
        }
    } else {
        translate([0, 0, handle_height / 2])
            linear_extrude(1.4)
            offsetThin(gap, 3);
    }
}

