function trade(position) {
    const heads = () => Math.random() < 0.5;
    if (position.open) {
        if(heads()) {
            return -1; // close
        } else {
            return 0; // stay
        }
    } else {
        if(heads()) {
            return 1; // open
        } else {
            return 0; // stay
        }
    }
}