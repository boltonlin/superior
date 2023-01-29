import React, { useState, useEffect } from 'react';
import fetcher from '../../../fetchers';
import axios from 'axios';
import CompareModal from './CompareModal.jsx';
import { AiOutlineStar, AiTwotoneStar } from 'react-icons/ai';
import StarRating from './StarRating.jsx';

export default function RelatedProduct({ start, last, feature, relProd }) {

  const [image, setImage] = useState();
  const [showModal, setShowModal] = useState(false);
  const [showImg, setShowImg] = useState(false);
  const [ratings, setRatings] = useState(0);

  useEffect(() => {
    axios.all([
      fetcher.related.getProductStyle(relProd.id),
      fetcher.related.getReviewMeta(relProd.id)
    ])
      .then(axios.spread((...data) => {
        // console.log(data[0].data.results[0]);
        setImage(data[0].data.results[0]);
        // console.log(data[1].data);
        setRatings(data[1].data);
      }))
      .catch(err => console.error(err));
    // fetcher.related.getProductStyle(relProd.id)
    //   .then(({ data }) => setImage(data.results[0]))
    //   .catch(err => console.log(err));
  }, [feature]);

  // TODO: FIX NO IMAGE LATER
  if (!image || !image.photos[0].thumbnail_url) {
    return <div></div>;
  }

  console.log(ratings);

  return (
    <div>
      <div className="rel-item">
        <AiOutlineStar className="star-modal" onClick={() => setShowModal(true)} />
        <img id="rel-img" src={image.photos[0].thumbnail_url} alt={relProd.description}
          onMouseEnter={() => setShowImg(true)} onMouseLeave={() => setShowImg(false)} />
        {showImg && <img id="rel-ori-img" src={image.photos[0].url} alt={relProd.description} />}
        <div className="rel-cat">{relProd.category}</div>
        <div className="rel-name">{relProd.name}</div>
        <div className="rel-slogan">{relProd.slogan}</div>
        {image.sale_price && <div className="rel-sale-price">{'$' + image.sale_price}</div>}
        <div className="rel-orig-price">{'$' + image.original_price}</div>
        <StarRating ratingPercentage={'50%'}></StarRating>
      </div>
      {showModal &&
        (<div className="overlay">
          <div className="modal-container">
            <CompareModal setShowModal={setShowModal} feature={feature} relProd={relProd} />
          </div>
        </div>)
      }
    </div>
  );
}