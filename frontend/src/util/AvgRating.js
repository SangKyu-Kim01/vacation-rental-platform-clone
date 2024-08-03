const calculateAvgRating = (reviews) => {
  console.log("Reviews to calculate :", reviews);
  const totalRating = reviews?.reduce((acc, item) => acc + item.rating, 0);
  const avgRating =
    totalRating === 0
      ? ""
      : totalRating === 0
      ? totalRating.toFixed(2)
      : (totalRating / reviews?.length).toFixed(2);

  return {
    totalRating,
    avgRating,
  };
};

export default calculateAvgRating;
