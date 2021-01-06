import Layout from "../components/layout";
import GraphQLClient from "../utils/graphQLClient";
import { getCompletedWorkoutsByUser } from "../graphql/queries";
import { useState } from "react";
import auth0 from "../utils/auth0";

export default function WorkoutHistory({ workouts, user }) {
  console.log(workouts);
  console.log(user);

  return (
    <Layout user={user}>
      <main>
        {workouts.map((workout) => {
          return (
            <div className={"workout"} key={workout._id}>
              <h2>{workout.name}</h2>
              {workout.exercises.map((exercise) => {
                return (
                  <div className="exercise" key={exercise.name}>
                    <h3>{exercise.name}</h3>
                    {exercise.sets.map((set, index) => {
                      return (
                        <div className="set" key={index}>
                          <h4>Set {index}</h4>
                          <h5>
                            {set.reps} reps x {set.weight} kg{" "}
                          </h5>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          );
        })}
      </main>
    </Layout>
  );
}

export async function getServerSideProps({ req, res }) {
  try {
    const session = await auth0.getSession(req);
    const { query, variables } = getCompletedWorkoutsByUser(
      session.user.userID
    );
    const res = await GraphQLClient.request(query, variables);
    const workouts = res.findUserByID.completedWorkouts.data;
    return {
      props: { workouts, user: session.user },
    };
  } catch (error) {
    console.error(error);
    res.writeHead(302, { Location: "/" });
    res.end();
  }
  return { props: {} };
}