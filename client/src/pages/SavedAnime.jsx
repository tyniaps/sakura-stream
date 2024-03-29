import React from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { QUERY_ME } from '../utils/queries';
import { DELETE_ANIME } from '../utils/mutations';
import { removeAnimeId } from '../utils/localStorage';
import Auth from '../utils/auth';
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Button,
} from "@material-tailwind/react";
import { motion, AnimatePresence } from 'framer-motion';



const SavedAnimes = () => {
  const { loading, data } = useQuery(QUERY_ME);
  const [removeAnime, { error: mutationError }] = useMutation(DELETE_ANIME);
  const userData = data?.me || {};


  const handleRemoveAnime = async (_id) => {
    console.log('handleRemoveAnime called', _id);
    const token = Auth.loggedIn() ? Auth.getToken() : null;
    console.log('Token:', token);

    if (!token) {
      console.log('No token found');
      return false;
    }

    try {
      const { data } = await removeAnime({
        variables: { _id },
      });
      console.log('Mutation successful, data:', data);

      removeAnimeId(_id);
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) {
    return <h2>LOADING...</h2>;
  }

  return (
    <>
      <div className="p-5 bg-opacity-40">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold text-center search-title">Your Saved Animes</h1>
        </div>
      </div>
      <div className="container mx-auto mt-8 text-center">
        {userData.savedAnimes?.length
          ? `Viewing ${userData.savedAnimes.length} saved ${userData.savedAnimes.length === 1 ? 'anime' : 'animes'}:`
          : 'You have no saved animes!'}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {userData.savedAnimes?.map((anime) => (
            <motion.div 
              key={anime._id} 
              className="mt-6 w-96"
              whileHover={{ scale: 1.05 }}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Card className="flex flex-col justify-between pink-transparent-bg">
                <CardHeader color="blue-gray" className="relative h-56">
                  <img
                    src={anime.image}
                    alt={anime.title}
                    className="h-full w-full object-cover"
                  />
                </CardHeader>
                <CardBody>
                  <Typography variant="h5" color="blue-gray" className="mb-2">
                    {anime.title}
                  </Typography>
                  <Typography>
                    {anime.synopsis || "No description available."}
                  </Typography>
                </CardBody>
                <CardFooter className="flex justify-between items-center">
                  <Button
                    onClick={() => handleRemoveAnime(anime._id)}
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                  >
                    Delete
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
        {mutationError && <div className="text-red-600 mt-5">Error: {mutationError.message}</div>}
      </div>
    </>
  );
  
}

export default SavedAnimes;