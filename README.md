# BILFO #
Fall 2024-2025 CS 319 Term Project

## Members ##
* Ata Uzay Kuzey
* Duru Solakoğlu
* Emir Görgülü
* Kerem Demirören
* Nazlı Apaydın

### About the project ###
BILFO (Bilkent Information Office application) aims to streamline and modernize how high schools, prospective students, university administrators, and information office staff interact with the BTO. Our goal is to simplify and automate the process of booking visitations, tours, and fairs by building a full-stack web application. This web app will solve several logistical issues related to planning and scheduling such activities by offering an organized, user-friendly platform. Currently, booking visitations or tours to Bilkent requires manual coordination, which can be inefficient for both visitors and the university staff. The app will serve information office staff directly by reducing administrative workload and providing them with comprehensive data along with services in one centralized system.

Key Problems Solved: 
* Automating campus tour bookings for high schools and assignment of their guides.
* Introducing a new high school prioritization system for tour bookings and customized tours.
* Providing a platform that offers real-time updates and communication between the university and visitors.
* Ensuring that all relevant stakeholders (high schools and their counselors, prospective students, admins, information office advisors, information office coordinator and guides) can access the information they need easily.

## Features ##
* Interface: Separate interfaces for visitors, admins, advisors, guides and the coordinator. There will also be different roles with different levels of access.
* Tour Booking System: High schools and individuals can schedule campus visits and tours. High schools fill the application form within the system which is later seen by advisors with the priority order. The application form for high schools includes terms & conditions, number of students, a dropdown menu to choose the school, contact information, and busy hours to lower the number of rejections. Necessary guide numbers are determined automatically from the student count. If a time slot already has an accepted tour, the further applicants will be shown a message strongly discourraging them from booking that slot. For individual tours, further information about the student's major of interest is asked to assign an appropriate guide.
* High schools and individuals will be able to choose multiple hours so that a schedule that fits all the applicants can be created more easily. If a single high school or individual applies more than once, the system will notice that and flag it as spam.
* Fair applications: High schools which organize university fairs and want Bilkent to attend can fill the application. After approval, the guides can see the list of appliable fairs.
* Notifications & Reminders: Reminders and confirmation for upcoming events will be delivered by email to the applicants email.
* Dashboard: Coordinators and advisors can manage visits, view schedules, and add/remove guides. There will be two tables: A table for all applied tours, and a table for all approved tours. Only coordinator and advisors can see the first table and approve tours. Then, the applied tour automatically gets transferred to the approved table. Also, only the coordinator can see the gathered data within the system, including tour count, city distribution of attending schools etc.
* There will be a priority recommendation function to sort the high schools that applied. It will provide options to sort by time of application, distance to Bilkent, YKS scores, and loyalty to Bilkent. Additionally, all the high schools will be distributed into four different categories based on their YKS scores, and loyalty to Bilkent: ?, Maintanence, Nurturing, ✰. These information will only be available for the coordinator and advisors.
* Guides can volunteer for a guideless tour in the approved tours table. If no guide volunteers, the advisor of the day can appoint a guide.
* Guides and advisors can enter their Bilkent Schedules to avoid getting called for tours which happen at their course hours. They can also reserve hours for themselves for things not shown on the stars site (like tutoring sessions).
### Selling Points ###
* Intuitive and user-friendly interface.
* Automated booking and scheduling.
* Personalized experiences for different user types.
* Real-time notifications and updates.

