import React, { useEffect, useState } from 'react';
import tmdb from './tmdb';
import './App.css';
import MovieRow from './components/MovieRow';
import FeaturedMovie from './components/FeaturedMovie';
import Header from './components/Header';

export default () => {
    const [movieList, setMovieList] = useState([]);
    const [FeaturedData, setFeaturedData] = useState(null);
    const [blackHeader, setBlackHeader] = useState(false);

    useEffect(()=>{
        const loadAll = async () => {
            // Pegando a lista TOTAL
            let list = await tmdb.getHomeList();
            setMovieList(list);

            // Pegando o Featured
            let originals = list.filter(i=>i.slug === 'originals');
            let randomChosen = Math.floor(Math.random() * (originals[0].items.results.length -1));
            let chosen = originals[0].items.results[randomChosen];
            let chosenInfo = await tmdb.getMovieInfo(chosen.id, 'tv');
            setFeaturedData(chosenInfo);
        }
        loadAll();
    }, []);

    useEffect(()=>{
        const scrollListiner = () => {
            if(window.scrollY > 10) {
                setBlackHeader(true);
            } else {
                setBlackHeader(false);
            }
        }

        window.addEventListener('scroll', scrollListiner);
        return () => {
            window.removeEventListener('scroll', scrollListiner);
        }
    }, []);


    return (
        <div className="page">

            <Header black={blackHeader} />

            {FeaturedData &&
                <FeaturedMovie item={FeaturedData} />
            }

            <section className='lists'>
                {movieList.map((item, key)=>(
                    <MovieRow key={key} title={item.title} items={item.items} />
                ))}
            </section>

            <footer>
                Feito com <span role='img' aria-label='coração'>❤️</span> por Larissa Lunguinho<br/>
                Direitos de imagem para Netflix<br/>
                Dados pegos do site Themoviedb.org
            </footer>

            {movieList.length <= 0 &&
                <div className='loading'>
                    <img src="https://media.filmelier.com/noticias/br/2020/03/Netflix_LoadTime.gif" alt="Carregando" />
                </div>
            }
        </div>
    );
}
