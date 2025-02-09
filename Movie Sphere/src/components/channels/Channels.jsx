import styles from './channels.module.css'
import channel1 from '../../assets/channel1.jpg'
import channel2 from '../../assets/channel2.jpg'
import channel3 from '../../assets/channel3.png'
import channel4 from '../../assets/channel4.jpg'
import channel5 from '../../assets/channel5.jpg'
import channel6 from '../../assets/channel6.jpg'
import channel7 from '../../assets/channel7.jpg'
import channel8 from '../../assets/channel8.jpg'
const Channels = () => {
  return (
    <>
        <div className={styles.channels}>

            <img src={channel1} alt="channel" />
            <img src={channel2} alt="channel" />
            <img src={channel3} alt="channel" />
            <img src={channel4} alt="channel" />
            <img src={channel5} alt="channel" />
            <img src={channel6} alt="channel" />
            <img src={channel7} alt="channel" />
            <img src={channel8} alt="channel" />

        </div>
    </>
  )
}

export default Channels