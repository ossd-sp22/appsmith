package com.appsmith.external.git;

import com.appsmith.external.dtos.GitLogDTO;
import org.eclipse.jgit.api.errors.GitAPIException;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Mono;

import java.nio.file.Path;
import java.util.List;
import java.util.Map;

@Component
public interface GitExecutor {

    /**
     * This method will handle the git-commit functionality. Under the hood it checks if the repo has already been
     * initialised
     * @param repoPath parent path to repo
     * @param commitMessage message which will be registered for this commit
     * @param authorName author details
     * @param authorEmail author details
     * @return if the commit was successful
      Exceptions due to file operations
     */
    Mono<String> commitApplication(Path repoPath, String commitMessage, String authorName, String authorEmail);

    /**
     * Method to get the commit history
     * @param suffix SuffixedPath used to generate the base repo path
     * @return list of git commits

     * @throws
     */
    Mono<List<GitLogDTO>> getCommitHistory(Path suffix);

    /**
     * Method to create a new repository to provided path
     * @param repoPath path where new repo needs to be created
     * @return if the operation was successful
     */
    boolean createNewRepository(Path repoPath) throws GitAPIException;

    /**
     * Method to push changes to remote repo
     * @param branchSuffix Path used to generate the repo url specific to the application which needs to pushed to remote
     * @param remoteUrl remote repo url
     * @param publicKey
     * @param privateKey
     * @return Success message
      exception thrown if git open repo failed
     */
    Mono<String> pushApplication(Path branchSuffix, String remoteUrl, String publicKey, String privateKey);

    /** Clone the repo to the file path
     *  Children branches - containerVolume/orgId/defaultAppId/repo/branchName/applicationData
     *  Default branch containerVolume/orgId/defaultAppId/repo/applicationData
     *  @param repoSuffix combination of orgId and defaultId
     *  @param remoteUrl ssh url of the git repo(we support cloning via ssh url only with deploy key)
     *  @param privateKey generated by us and specific to the defaultApplication
     *  @param publicKey generated by us and specific to the defaultApplication
     *  @return defaultBranchName of the repo
     *
     * */
    Mono<String> cloneApplication(Path repoSuffix, String remoteUrl, String privateKey, String publicKey);

    /**
     * Create a new worktree in the local repo
     * @param repoSuffix repo suffix path in local repo
     * @param branchName branch which needs to be generated
     * @return generated branch name
     */
    Mono<String> createAndCheckoutToBranch(Path repoSuffix, String branchName);

    /**
     * Git checkout to specific branch
     *  @param repoSuffix repo suffix path in local repo
     * @param branchName name of the branch which needs to be checked out
     * @return
     */
    Mono<Boolean> checkoutToBranch(Path repoSuffix, String branchName);

    /**
     * Pull changes from remote branch and merge the changes
     * @param repoPath combination of orgId and defaultId
     * @param remoteUrl ssh url of the git repo(we support cloning via ssh url only with deploy key)
     * @param branchName remoteBranchName from which commits will be fetched and merged to the current branch
     * @param privateKey generated by us and specific to the defaultApplication
     * @param publicKey generated by us and specific to the defaultApplication
     * @return success message
     * @throws

     */
    Mono<String> pullApplication(Path repoPath, String remoteUrl, String branchName, String privateKey, String publicKey);

    /**
     *
     * @param repoSuffix
     * @return List of branches for the application
     * @throws

     */
    Mono<List<String>> getBranches(Path repoSuffix);

    /**
     * This method will handle the git-status functionality
     *
     * @param repoPath Path to actual repo
     * @param branchName branch name for which the status is required
     * @return Map of file names those are added, removed, modified
     * @throws  exceptions due to git commands
      Exceptions due to file operations
     */
    Mono<Map<String, Object>> getStatus(Path repoPath, String branchName);

    /**
     *
     * @param repoPath combination of orgId and defaultId
     * @param sourceBranch name of the branch whose commits will be referred amd merged to destinationBranch
     * @param destinationBranch Merge operation is performed on this branch
     * @return Merge status

     */
    Mono<String> mergeBranch(Path repoPath, String sourceBranch, String destinationBranch);
}
