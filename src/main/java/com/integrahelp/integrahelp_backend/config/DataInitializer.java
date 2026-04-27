package com.integrahelp.integrahelp_backend.config;

import com.integrahelp.integrahelp_backend.model.*;
import com.integrahelp.integrahelp_backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component @RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {
    private final UserRepository userRepo;
    private final DepartmentRepository deptRepo;
    private final PasswordEncoder encoder;

    @Override
    public void run(String... args) {
        if (deptRepo.count() > 0) return; // already seeded

        // Create Departments
        Department infra = deptRepo.save(Department.builder()
            .name("Infrastructure").code("INFRA").icon("business")
            .description("Facilities, temperature, lighting")
            .issueTypesJson("[\"Temperature Issue\",\"Lighting Issue\",\"Seating Issue\",\"Cleanliness\"]")
            .build());
        Department it = deptRepo.save(Department.builder()
            .name("IT Support").code("IT").icon("computer")
            .description("Hardware, network, software")
            .issueTypesJson("[\"Hardware Failure\",\"Network Issue\",\"Software Bug\",\"Access Request\"]")
            .build());
        Department hr = deptRepo.save(Department.builder()
            .name("Human Resources").code("HR").icon("people")
            .description("Payroll, leave, harassment")
            .issueTypesJson("[\"Payroll Issue\",\"Leave Issue\",\"Harassment\",\"Policy Clarification\"]")
            .build());
        Department fin = deptRepo.save(Department.builder()
            .name("Finance").code("FIN").icon("account_balance")
            .description("Reimbursements, invoices")
            .issueTypesJson("[\"Reimbursement\",\"Invoice Issue\",\"Budget Query\"]")
            .build());
        Department admin = deptRepo.save(Department.builder()
            .name("Admin / Security").code("ADMIN").icon("security")
            .description("Access, visitors, parking")
            .issueTypesJson("[\"Access Card Issue\",\"Visitor Pass\",\"Parking Issue\",\"Safety Concern\"]")
            .build());

        // Create Admins per department
        userRepo.save(User.builder().username("admin.infra")
            .password(encoder.encode("Admin@123")).email("admin.infra@integrahelp.com")
            .fullName("Infra Admin").role(User.Role.ADMIN).department(infra).active(true).build());
        userRepo.save(User.builder().username("admin.it")
            .password(encoder.encode("Admin@123")).email("admin.it@integrahelp.com")
            .fullName("IT Admin").role(User.Role.ADMIN).department(it).active(true).build());
        userRepo.save(User.builder().username("admin.hr")
            .password(encoder.encode("Admin@123")).email("admin.hr@integrahelp.com")
            .fullName("HR Admin").role(User.Role.ADMIN).department(hr).active(true).build());
        userRepo.save(User.builder().username("admin.fin")
            .password(encoder.encode("Admin@123")).email("admin.fin@integrahelp.com")
            .fullName("Finance Admin").role(User.Role.ADMIN).department(fin).active(true).build());
        userRepo.save(User.builder().username("admin.sec")
            .password(encoder.encode("Admin@123")).email("admin.sec@integrahelp.com")
            .fullName("Security Admin").role(User.Role.ADMIN).department(admin).active(true).build());

        // Employees
        userRepo.save(User.builder().username("emp1")
            .password(encoder.encode("Emp@123")).email("emp1@integrahelp.com")
            .fullName("John Employee").role(User.Role.USER).active(true).build());
        userRepo.save(User.builder().username("emp2")
            .password(encoder.encode("Emp@123")).email("emp2@integrahelp.com")
            .fullName("Jane Employee").role(User.Role.USER).active(true).build());
        System.out.println("=== IntegraHelp seed data loaded ===");
    }
}
