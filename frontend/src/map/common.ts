import { Offcanvas, Toast } from 'bootstrap';

export const init = () => {
    const bsOffcanvas = new Offcanvas('#offcanvas');
    const toastMsg = new Toast('.toast', {
        autohide: true,
        animation: true,
        delay: 3000
    });
    return {
        bsOffcanvas,
        toastMsg
    }
}