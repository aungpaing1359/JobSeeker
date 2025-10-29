import { useRef, useState, useEffect } from "react";
import Slider from "react-slick";
import axios from "axios";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const NextArrow = ({ onClick, show }) => {
  if (!show) return null;
  return (
    <div
      onClick={onClick}
      className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white border shadow-md rounded-full p-2 cursor-pointer hover:bg-gray-100"
    >
      <ChevronRight size={20} />
    </div>
  );
};

const PrevArrow = ({ onClick, show }) => {
  if (!show) return null;
  return (
    <div
      onClick={onClick}
      className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white border shadow-md rounded-full p-2 cursor-pointer hover:bg-gray-100"
    >
      <ChevronLeft size={20} />
    </div>
  );
};

export default function FeaturedCompanies() {
  const navigate = useNavigate();
  const sliderRef = useRef(null);
  const [companies, setCompanies] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slidesToShow, setSlidesToShow] = useState(5);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/accounts-employer/company/")
      .then((res) => {
        console.log("Company API Response:", res.data);
        const data = res.data.companies || []; // 👈 correct key
        setCompanies(data);
      })
      .catch((err) => {
        console.error("Error fetching companies:", err);
      });
  }, []);

  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    beforeChange: (oldIndex, newIndex) => setCurrentSlide(newIndex),
    responsive: [
      { breakpoint: 1280, settings: { slidesToShow: 4 } },
      { breakpoint: 1024, settings: { slidesToShow: 3 } },
      { breakpoint: 640, settings: { slidesToShow: 2 } },
      { breakpoint: 420, settings: { slidesToShow: 1 } },
    ],
  };

  const lastSlideIndex = companies.length - slidesToShow;

  return (
    <div className="relative px-4 py-4">
      <PrevArrow
        onClick={() => sliderRef.current.slickPrev()}
        show={currentSlide !== 0}
      />

      <Slider ref={sliderRef} {...settings}>
        {companies.map((company, i) => (
          <div key={i} className="px-3">
            <div
              onClick={() => navigate(`/companies/${company.id}`)}
              className="border rounded-lg shadow-md text-center py-4 bg-gray-100 flex flex-col gap-[10px] items-center justify-center border-[#EDEDED] opacity-100 cursor-pointer"
            >
              <img
                src={company.logo || "/default-logo.png"}
                alt={company.business_name}
                className="h-12 mx-auto mb-4 object-contain gray-text-custom"
              />
              <h3 className="font-semibold gray-text-custom py-2 text-lg">
                {company.business_name}
              </h3>
              <p className="text-sm gray-text-custom mb-3">
                {company.industry || "No industry info"}
              </p>
              <button className="px-4 py-1 rounded-md bg-[#E6F4FE] custom-blue-text">
                {company.job_count || 0} jobs
              </button>
            </div>
          </div>
        ))}
      </Slider>

      <NextArrow
        onClick={() => sliderRef.current.slickNext()}
        show={currentSlide < lastSlideIndex}
      />
    </div>
  );
}
