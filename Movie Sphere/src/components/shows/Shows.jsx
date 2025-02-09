import Show from '../show/Show'
import styles from './shows.module.css'

const Shows = (props) => {
  return (
    <>
        <section className={styles.shows}>

            <h1>{props.title}</h1>

            <div className={styles.showsParent}>

                {
                    props.movies.map((movie)=>{
                        return <Show movie={movie}/>
                    })
                }
                
                   

            </div>


        </section>
    </>
  )
}

export default Shows