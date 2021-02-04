import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import icon from '../assets/webpack-icon.png';

const writeHello = function (): void {
    const element = document.querySelector('#placeholder') as HTMLDivElement;
    element.innerHTML = ['Hello', 'webpack'].join(' ');
}

const addImage = function (): void {
    const element = document.querySelector('#image') as HTMLDivElement;

    const myIcon = new Image();
    myIcon.src = icon;

    element.appendChild(myIcon);
}

writeHello();
addImage();
