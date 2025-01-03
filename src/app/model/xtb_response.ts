export interface xtb_response_all_open_positions {
    cmd:              number;
    order:            number;
    digits:           number;
    offset:           number;
    order2:           number;
    position:         number;
    symbol:           string;
    comment:          string;
    customComment:    null;
    commission:       number;
    storage:          number;
    margin_rate:      number;
    close_price:      number;
    open_price:       number;
    nominalValue:     number;
    profit:           number;
    volume:           number;
    sl:               number;
    tp:               number;
    closed:           boolean;
    timestamp:        number;
    spread:           number;
    taxes:            number;
    open_time:        number;
    open_timeString:  string;
    close_time:       null;
    close_timeString: null;
    expiration:       null;
    expirationString: null;
}