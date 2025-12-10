import { Button } from 'primereact/button';
import { Menu } from 'primereact/menu';
import  { useRef, useState, useEffect, useContext } from 'react';
import { RTLContext } from '../App';
import { classNames } from 'primereact/utils';
import { InputText } from 'primereact/inputtext';
import { OverlayPanel } from 'primereact/overlaypanel';


export default function ChatComponent() {
        useEffect(() => {
            (async () => {
                try {
               
                } catch (error) {
                }
            })();
        }, []); // eslint-disable-line react-hooks/exhaustive-deps
    const menu10 = useRef<any>(null);
    const menu8 = useRef<any>(null);
    const isRTL = useContext(RTLContext)
    const op = useRef<any>(null)
    const chatcontainer = useRef<any>(null);
    const chatEmojis = [
        '😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😇', '😉', '😊', '🙂', '🙃', '😋', '😌', '😍', '🥰', '😘', '😗', '😙', '😚', '🤪', '😜', '😝', '😛',
        '🤑', '😎', '🤓', '🧐', '🤠', '🥳', '🤗', '🤡', '😏', '😶', '😐', '😑', '😒', '🙄', '🤨', '🤔', '🤫', '🤭', '🤥', '😳', '😞', '😟', '😠', '😡', '🤬', '😔',
        '😟', '😠', '😡', '🤬', '😔', '😕', '🙁', '😬', '🥺', '😣', '😖', '😫', '😩', '🥱', '😤', '😮', '😱', '😨', '😰', '😯', '😦', '😧', '😢', '😥', '😪', '🤤'
    ];
    const [chatMessages, setChatMessages] = useState([
        { from: 'Ioni Bowcher', url: 'assets/demo/images/avatar/ionibowcher.png', messages: ['Hey M. hope you are well.', 'Our idea is accepted by the board. Now it’s time to execute it'] },
        { messages: ['We did it! 🤠'] },
        { from: 'Ioni Bowcher', url: 'assets/demo/images/avatar/ionibowcher.png', messages: ['That\'s really good!'] },
        { messages: ['But it’s important to ship MVP ASAP'] },
        { from: 'Ioni Bowcher', url: 'assets/demo/images/avatar/ionibowcher.png', messages: ['I’ll be looking at the process then, just to be sure 🤓'] },
        { messages: ['That’s awesome. Thanks!'] }
    ]);
    const onChatKeydown = (event: any) => {
        if (event.key === 'Enter') {
            let message = event.target.value;
            let newChatMessages = [...chatMessages];
            let lastMessage = newChatMessages[newChatMessages.length - 1];
            if (lastMessage.from) {
                newChatMessages.push({ messages: [message] });
                setChatMessages(newChatMessages)
            } else {
                lastMessage.messages.push(message);
                setChatMessages(newChatMessages)
            }
            if (message.match(/primeng|primereact|primefaces|primevue/i)) {
                newChatMessages.push({ from: 'Ioni Bowcher', url: 'assets/demo/images/avatar/ionibowcher.png', messages: ['Always bet on Prime!'] });
                setChatMessages(newChatMessages)
            }
            event.target.value = '';
            const el = chatcontainer.current;
            setTimeout(() => {
                el.scroll({
                    top: el.scrollHeight,
                    behavior: 'smooth'
                });
            }, 1);
        }
    }
    return (
        <>

            <div className="p-col-12 p-lg-3">
                <div className="card height-100">
                    <div className="card-header">
                        <h5>Đoạn chat</h5>
                        <div>
                            <Button type="button" icon="pi pi-ellipsis-h" className="p-button-rounded p-button-text p-button-plain" onClick={(event) => menu10.current.toggle(event)}></Button>
                            <Menu ref={menu10} popup model={[{ label: 'Update', icon: 'pi pi-fw pi-refresh' }, { label: 'Edit', icon: 'pi pi-fw pi-pencil' }]}></Menu>
                        </div>
                    </div>
                    <ul className="widget-bestsellers">
                        <li>
                            <div className="bestseller-item p-d-flex p-ai-center p-p-3 p-mb-2">
                                <img src="assets/demo/images/avatar/ionibowcher.png" alt="product" className={classNames({ 'p-mr-3': !isRTL, 'p-ml-3': isRTL })} />
                                <span>Trợ lý</span>
                                <span className="item-button"><button className="p-link"><i className="pi pi-chevron-right"></i></button></span>
                            </div>

                            <div className="bestseller-item p-d-flex p-ai-center p-p-3 p-mb-2">
                                <img src="assets/demo/images/avatar/ionibowcher.png" alt="product" className={classNames({ 'p-mr-3': !isRTL, 'p-ml-3': isRTL })} />
                                <span>Giám đốc công nghệ</span>
                                <span className="item-button"><button className="p-link"><i className="pi pi-chevron-right"></i></button></span>
                            </div>

                            <div className="bestseller-item p-d-flex p-ai-center p-p-3 p-mb-2">
                                <img src="assets/demo/images/avatar/ionibowcher.png" alt="product" className={classNames({ 'p-mr-3': !isRTL, 'p-ml-3': isRTL })} />
                                <span>Quản trị hệ thống</span>
                                <span className="item-button"><button className="p-link"><i className="pi pi-chevron-right"></i></button></span>
                            </div>

                            <div className="bestseller-item p-d-flex p-ai-center p-p-3 p-mb-2">
                                <img src="assets/demo/images/avatar/ionibowcher.png" alt="product" className={classNames({ 'p-mr-3': !isRTL, 'p-ml-3': isRTL })} />
                                <span>Thư ký</span>
                                <span className="item-button"><button className="p-link"><i className="pi pi-chevron-right"></i></button></span>
                            </div>

                            <div className="bestseller-item p-d-flex p-ai-center p-p-3 p-mb-2">
                                <img src="assets/demo/images/avatar/ionibowcher.png" alt="product" className={classNames({ 'p-mr-3': !isRTL, 'p-ml-3': isRTL })} />
                                <span>Kế toán trưởng</span>
                                <span className="item-button"><button className="p-link"><i className="pi pi-chevron-right"></i></button></span>
                            </div>

                            <div className="bestseller-item p-d-flex p-ai-center p-p-3 p-mb-2">
                                <img src="assets/demo/images/avatar/ionibowcher.png" alt="product" className={classNames({ 'p-mr-3': !isRTL, 'p-ml-3': isRTL })} />
                                <span>Giám đốc tài chính</span>
                                <span className="item-button"><button className="p-link"><i className="pi pi-chevron-right"></i></button></span>
                            </div>

                            <div className="bestseller-item p-d-flex p-ai-center p-p-3 p-mb-2">
                                <img src="assets/demo/images/avatar/ionibowcher.png" alt="product" className={classNames({ 'p-mr-3': !isRTL, 'p-ml-3': isRTL })} />
                                <span>Giám đốc nhân sự</span>
                                <span className="item-button"><button className="p-link"><i className="pi pi-chevron-right"></i></button></span>
                            </div>

                            <div className="bestseller-item p-d-flex p-ai-center p-p-3 p-mb-2">
                                <img src="assets/demo/images/avatar/ionibowcher.png" alt="product" className={classNames({ 'p-mr-3': !isRTL, 'p-ml-3': isRTL })} />
                                <span>Tổng giám đốc</span>
                                <span className="item-button"><button className="p-link"><i className="pi pi-chevron-right"></i></button></span>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>

            <div className="p-col-12 p-lg-9">
                <div className="card height-100">
                    <div className="card-header">
                        <h5>Chat</h5>
                        <div>
                            <Button type="button" icon="pi pi-ellipsis-h" className="p-button-rounded p-button-text p-button-plain" onClick={(event) => menu8.current.toggle(event)}></Button>
                            <Menu ref={menu8} popup model={[{ label: 'View Media', icon: 'pi pi-fw pi-images' }, { label: 'Starred Messages', icon: 'pi pi-fw pi-star-o' }, { label: 'Search', icon: 'pi pi-fw pi-search' }]}></Menu>
                        </div>
                    </div>
                    <div className="widget-chat">
                        <ul ref={chatcontainer}>
                            {
                                chatMessages.map((chatMessage, i) => {
                                    const last = i === chatMessages.length - 1;
                                    return <li key={i} className={classNames('p-d-flex p-ai-start', { 'from': chatMessage.from, 'own p-jc-end': !chatMessage.from, 'p-mb-3': !last, 'p-mb-1': last })}>
                                        {chatMessage.url && <img src={chatMessage.url} alt="avatar" className={classNames({ 'p-mr-2': !isRTL, 'p-ml-2': isRTL })} />}
                                        <div className={classNames('messages p-d-flex p-flex-column', { 'p-ai-start': chatMessage.from, 'p-ai-end': !chatMessage.from })}>
                                            {
                                                chatMessage.messages.map((message, i) => {
                                                    const first = i === 0
                                                    return <span key={i} className={classNames('message', { 'cyan-bgcolor': chatMessage.from, 'pink-bgcolor': !chatMessage.from, 'p-mt-1': !first })}>
                                                        {message}
                                                    </span>
                                                })
                                            }
                                        </div>
                                    </li>
                                })
                            }
                        </ul>
                        <div className="p-inputgroup write-message p-mt-3">
                            <span className="p-inputgroup-addon">
                                <Button type="button" icon="pi pi-plus-circle" className="p-button-text p-button-plain"></Button>
                            </span>
                            <InputText placeholder="Write your message (Hint: 'PrimeReact')" onKeyDown={onChatKeydown} />
                            <span className="p-inputgroup-addon">
                                <Button type="button" icon="pi pi-video" className="p-button-text p-button-plain"></Button>
                            </span>
                            <span className="p-inputgroup-addon">
                                <Button type="button" icon="pi pi-clock" className="p-button-text p-button-plain"></Button>
                                <OverlayPanel ref={op} className="emoji">
                                    {
                                        chatEmojis.map((emoji, i) => {
                                            return <Button key={i} type="button" label={emoji} className="emoji-button p-p-2 p-button-text p-button-plain"></Button>
                                        })
                                    }
                                </OverlayPanel>
                            </span>
                        </div>
                    </div>
                </div>
            </div>

        </>
    );
}