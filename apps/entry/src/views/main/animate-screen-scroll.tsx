import { Fragment, useEffect } from "react";
import { MAIN_SUB_APP_LIST } from "@utils/const";
import classnames from "classnames";
import '@views/main/index.style.scss';
import anime from "animejs";

const list = new Array(8).fill(0);

const AnimateScreenScroll = () => {
    useEffect(() => {
        const circleList = document.querySelectorAll(".circle")!;
        const subAppWrapper = document.querySelector(".sub-app-wrapper")!;
        const circle8 = document.querySelector(".circle-8")!;
        anime.timeline({
            duration: 200,
            easing: 'easeInOutSine',
        })
            .add({
            targets: '.circle-8',
            translateX: '685%',
            begin: () => {
                circleList.forEach(circle => {
                    circle.classList.add("no-filter");
                })
            },
            complete: (a: any) => {
                circle8.classList.add("has-text");
                subAppWrapper.classList.add("sub-fade-in");
            }
            }, 400)
            .add({
                targets: '.circle-7',
                translateX: '400%',
            }, 450)
            .add({
                targets: '.circle-6',
                translateX: '370%',
            }, 500)
            .add({
                targets: '.circle-5',
                translateX: '170%',
            }, 550)
            .add({
                targets: '.circle-4',
                translateX: '150%',
            },  600)
            .add({
                targets: '.circle-3',
                translateX: '85%',
            }, 650)
            .add({
                targets: '.circle-2',
                translateX: '36%',
            }, 700)
    }, []);

    return (
        <>
            <div className="bubble-list-wrapper">
                {
                    list.map((circle, index) =>
                        <Fragment key={index}>
                            <div className={classnames(`circle-${index+1}`, "circle")}>
                                {(index + 1 === list.length) && <span className="circle-text">创建应用</span>}
                            </div>
                        </Fragment>
                    )}
            </div>
            <div className="sub-app-wrapper">
                { MAIN_SUB_APP_LIST.map((sub, index) =>
                    <div className="sub-app-item" key={index}>
                        <i className={classnames(sub.icon, "sub-icon")}></i>
                        <span className="sub-text">{sub.text}</span>
                    </div>
                )}
            </div>
        </>
    );
}
export default AnimateScreenScroll;
