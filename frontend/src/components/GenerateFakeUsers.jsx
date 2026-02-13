import { faker } from '@faker-js/faker';

const GenerateFakeUser = () => {
    return {
        id:faker.string.uuid(),
        FullName:faker.person.fullName(),
        Job:faker.person.jobTitle(),
        Experience:faker.number.int({ min: 1, max:25 }),
        Gender:faker.person.sex(),
    }
}


const GenerateFakeUsers = () => {


    const users=[];

    Array.from({length:40}).forEach(()=>{
        users.push(GenerateFakeUser());
    })

    // console.log(users);
    
    return users;

}


export default GenerateFakeUsers;
