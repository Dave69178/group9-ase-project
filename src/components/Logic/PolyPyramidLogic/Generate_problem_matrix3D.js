import { Shape3D } from "./Shape3D";
import {A, B, C, D, E, F, G, H, I, J, K, L} from "./Shapes3D";

let shape_cols = {
    "A": 0,
    "B": 1,
    "C": 2,
    "D": 3,
    "E": 4,
    "F": 5,
    "G": 6,
    "H": 7,
    "I": 8,
    "J": 9,
    "K": 10,
    "L": 11
};

export function coord_to_col(coord) {
    let out = 12;
    let z_diff = 0;
    let row_length = 0;
    if (coord[2] === 0) {
        z_diff = 0;
        row_length = 5;
    } else if (coord[2] === 1) {
        z_diff = 25;
        row_length = 4;
    } else if (coord[2] === 2) {
        z_diff = 25 + 16;
        row_length = 3;
    } else if (coord[2] === 3) {
        z_diff = 25 + 16 + 9;
        row_length = 2;
    } else {
        z_diff = 25 + 16 + 9 + 4;
        row_length = 1;
    }
    out += z_diff;
    out += row_length * coord[0] + coord[1];
    return out;
}

export function shape_to_row(shape) {
    let row = new Array(67);
    for (let i = 0; i < 67; i++) {
        row[i] = 0;
    }
    row[shape_cols[shape.name]] = 1;
    for (let i = 0; i < shape.layout.length; i++) {
        row[coord_to_col(shape.layout[i])] = 1;
    }
    return row;
}

export function generate_headers () {
    let headers = [];
    let shape_names = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"]
    for (let i of shape_names) {
        headers.push(i);
    }
    for (let z = 0; z < 5; z++) {
        for (let i = 0; i < 5 - z; i++) {
            for (let j = 0; j < 5 - z; j++) {
                headers.push(i.toString() + "," + j.toString() + "," + z.toString());
            }
        }
    }
    return headers;
}

let shapes = [A, B, C, D, E, F, G, H, I, J, K, L];

// Horizontal slices:
export function get_horizontal_slices() {
    let horizontal_slices = [];
    for (let i = 4; i >= 0; i--) {
        horizontal_slices.push([]);
        for (let x = 0; x < i + 1; x++) {
            for (let y = 0; y < i + 1; y++) {
                horizontal_slices[4 - i].push([x,y,4 - i]);
            }
        }
    }
    return horizontal_slices;
}

// Diagonal slices
export function get_diag_slices() {

    let diag_slices = [[new Array(), new Array(), new Array(), new Array()],
                       [new Array(), new Array(), new Array(), new Array()],
                       [new Array(), new Array(), new Array(), new Array()],
                       [new Array(), new Array()]];    
    let horiz_slice = get_horizontal_slices()
    let count = 0;
    for (let layer of horiz_slice) {
        let max = Math.sqrt(layer.length) - 1;
        for (let coord of layer) {
            if (max - coord[1] - coord[0] === 3) {
                diag_slices[0][0].push(coord);  // TL 3 diag
            } else if (max - coord[1] - coord[0] === -3) {
                diag_slices[0][2].push(coord);  // BL 3 diag
            } else if (max - coord[1] - coord[0] === 2) {
                diag_slices[1][0].push(coord);  // TL 6 diag
            } else if (max - coord[1] - coord[0] === -2) {
                diag_slices[1][2].push(coord);  // BL 6 diag
            } else if (max - coord[1] - coord[0] === 1) {
                diag_slices[2][0].push(coord);  // TL 10 diag
            } else if (max - coord[1] - coord[0] === -1) {
                diag_slices[2][2].push(coord);  // BL 10 diag
            } else if (max - coord[1] - coord[0] === 0) {
                diag_slices[3][0].push(coord);  // TR to BL 15 diag
            }
            
            if (coord[1] - coord[0] === 3) {
                diag_slices[0][1].push(coord);  // TL 3 diag
            } else if (coord[1] - coord[0] === -3) {
                diag_slices[0][3].push(coord);  // BL 3 diag
            } else if (coord[1] - coord[0] === 2) {
                diag_slices[1][1].push(coord);  // TL 6 diag
            } else if (coord[1] - coord[0] === -2) {
                diag_slices[1][3].push(coord);  // BL 6 diag
            } else if (coord[1] - coord[0] === 1) {
                diag_slices[2][1].push(coord);  // TL 10 diag
            } else if (coord[1] - coord[0] === -1) {
                diag_slices[2][3].push(coord);  // BL 10 diag
            } else if (coord[1] - coord[0] === 0) {
                diag_slices[3][1].push(coord);  // TL to BR 15 diag
            }
        }
        count += 1;
    }
    return diag_slices;
}

let diag_slices = get_diag_slices();


export function convert_rect_coords_to_diags(shape_layout, size) {
    let out = new Array();
    if (size !== 5) {
        let out = new Array(4);
    } else {
        let out = new Array(2);
    }
    let diags = diag_slices[size - 2];
    let count = 0;
    for (let diag of diags) {
        let layout = structuredClone(shape_layout);
        for (let i = 0; i < shape_layout.length; i++) {
            if (shape_layout[i][1] - shape_layout[i][0] === 0) {
                layout[i] = diag[shape_layout[i][0]];
            } else if (shape_layout[i][1] - shape_layout[i][0] === 1) {
                layout[i] = diag[size + shape_layout[i][0]];
            } else if (shape_layout[i][1] - shape_layout[i][0] === 2) {
                layout[i] = diag[2 * size - 1 + shape_layout[i][0]];
            } else if (shape_layout[i][1] - shape_layout[i][0] === 3) {
                layout[i] = diag[3 * size - 3 + shape_layout[i][0]];
            } else if (shape_layout[i][1] - shape_layout[i][0] === 4) {
                layout[i] = diag[4 * size - 6 + shape_layout[i][0]];
            }
        }
        out[count] = layout;
        count += 1;
    }
    console.log(out);
    return out;
}

function add_row_for_diags_if_valid(problem_mat, shape, size) {
    // Check if contained within triangle
    for (let coord of shape.layout) {
        if (coord[0] > coord[1]) {
            return false;
        }
    }
    let placement_layouts = convert_rect_coords_to_diags(shape.layout, size);
    for (let layout of placement_layouts) {
        problem_mat.push(shape_to_row(new Shape3D(shape.name, layout)));
    }
    return true;
}

export let diags = get_diag_slices();

export function add_rows_for_shape_in_horizontal_and_vertical_slices(prob_mat, shape) {
    // Determine shape size and which slices it can fit into
    let max_size = 0
    for (let i in shape.layout) {
        if (i[0] > max_size) {
            max_size = i[0]
        }
        if (i[1] > max_size) {
            max_size = i[1]
        }
    }
    for (let size = 5; size >= max_size; size--) {
        for (let coord of shape.layout) {
            coord[2] = 5 - size;
        }
        let starting_pos_store = [];
        let rotation_count = 0;
        while (true) {
            let skip = false;
            for (let starting_layout of starting_pos_store) {
                if (shape.equal_layouts(starting_layout)) {
                    skip = true;
                }
            }
            if (!skip) {
                starting_pos_store.push(shape.layout);
                for (let row = 0; row < size; row++) {
                    let place_count = 0;
                    //console.log("Row: " + row.toString());
                    if (shape.translate(row, 0, size)) {
                        for (let col = 0; col < size; col++) {
                            if (col === 0) {
                                place_count += 1;
                                prob_mat.push(shape_to_row(shape));
                                add_row_for_diags_if_valid(prob_mat, shape, size);
                            } else if (shape.translate(0, 1, size)) {
                                place_count += 1;
                                prob_mat.push(shape_to_row(shape));
                                add_row_for_diags_if_valid(prob_mat, shape, size);
                                if (col === size - 1) {
                                    shape.reset_coord();
                                }
                            } else {
                                //console.log(place_count);
                                shape.reset_coord();
                                break;
                            }
                        }
                    }
                }
            }
            if (rotation_count < 4) {
                shape.rotate();
                rotation_count += 1;
                //console.log(shape.layout);
                //console.log("Rotation: " + rotation_count.toString());
            } else if (rotation_count === 4) {
                shape.flip();
                //console.log(shape.layout);
                rotation_count += 1;
                //console.log("Flip");
            } else if (rotation_count > 4 && rotation_count < 8) {
                shape.rotate();
                //console.log("Rotation: " + rotation_count.toString());
                rotation_count += 1;
            } else {
                //console.log("Size: " + problem_matrix.length.toString());
                break;
            }
        }
    }
    return prob_mat;
}


export function populate_problem_matrix3D() {
    let problem_matrix = [];
    for (let shape of shapes) {
        add_rows_for_shape_in_horizontal_and_vertical_slices(problem_matrix, shape);
    }
    return problem_matrix;
}